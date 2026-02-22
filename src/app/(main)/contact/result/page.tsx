"use client"; 

import { CheckCircle2 } from 'lucide-react'; 
import CommonButton from '@/app/components/common/CommonButton';

const SendPage = () => {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6 bg-white p-8 rounded-xl shadow-sm border">
        
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-300" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            送信が完了しました
          </h1>
          <p className="text-gray-600">
            お問い合わせいただきありがとうございます。<br />
            確認メールを送信しましたので、ご確認ください。
          </p>
        </div>

        <CommonButton text="ホームへ戻る"/>
      </div>
    </main>
  );
};

export default SendPage;