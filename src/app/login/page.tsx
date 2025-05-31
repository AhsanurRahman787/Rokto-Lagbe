'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';

const supabase = createClient();

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/');
    });
  }, []);

  const handleSendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone.startsWith('+880') ? phone : `+88${phone}`,
    });
    setLoading(false);

    if (error) alert(error.message);
    else setStep('otp');
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    setLoading(false);

    if (error) alert(error.message);
    else router.replace('/');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6 p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-red-600">Rokto Lagbe</h1>

        {step === 'phone' ? (
          <>
            <label className="block text-sm font-medium text-gray-700">Phone number (starts with +880)</label>
            <input
              type="tel"
              placeholder="+8801XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-400"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading || !phone}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-400"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || !otp}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
