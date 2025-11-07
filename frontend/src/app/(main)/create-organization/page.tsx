'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Step1CompanyInfo from './components/Step1CompanyInfo';
import Step2EmailVerification from './components/Step2EmailVerification';
import Step3OrgnameSelection from './components/Step3OrgnameSelection';
import { CheckCircle } from 'lucide-react';

/**
 * Organization Creation Wizard
 * 3-step process for creating an organization
 */
export default function CreateOrganizationPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [organizationData, setOrganizationData] = useState({
    organizationId: '',
    companyName: '',
    verificationToken: '',
  });

  const handleStep1Complete = (data: {
    organizationId: string;
    companyName: string;
    verificationToken?: string;
  }) => {
    setOrganizationData({
      organizationId: data.organizationId,
      companyName: data.companyName,
      verificationToken: data.verificationToken || '',
    });
    setCurrentStep(2);
  };

  const handleStep2Complete = () => {
    setCurrentStep(3);
  };

  const handleStep3Complete = (orgname: string) => {
    // Redirect to organization profile or dashboard
    router.push(`/profile/organizations`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Create Your Organization
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Set up your organization in 3 simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                    currentStep > step
                      ? 'border-green-500 bg-green-500'
                      : currentStep === step
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 bg-white'
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <span
                      className={`text-lg font-semibold ${
                        currentStep === step
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </span>
                  )}
                </div>

                {/* Connecting Line */}
                {index < 2 && (
                  <div
                    className={`h-1 w-24 ${
                      currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="mt-4 flex justify-center">
            <div className="flex w-full max-w-2xl justify-between px-6 text-center text-sm">
              <span
                className={`${currentStep >= 1 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
              >
                Company Info
              </span>
              <span
                className={`${currentStep >= 2 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
              >
                Email Verification
              </span>
              <span
                className={`${currentStep >= 3 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
              >
                Choose Orgname
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-lg bg-white p-8 shadow-xl">
          {currentStep === 1 && (
            <Step1CompanyInfo onComplete={handleStep1Complete} />
          )}
          {currentStep === 2 && (
            <Step2EmailVerification
              organizationId={organizationData.organizationId}
              verificationToken={organizationData.verificationToken}
              onComplete={handleStep2Complete}
            />
          )}
          {currentStep === 3 && (
            <Step3OrgnameSelection
              organizationId={organizationData.organizationId}
              companyName={organizationData.companyName}
              onComplete={handleStep3Complete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
