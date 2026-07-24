"use client"
import RegisterForm from '@/components/RegisterForm'
import Wellcome from '@/components/Wellcome'
import React, { useState } from 'react'

function Register() {
  const [step, setStep] = useState(1)
  return (
    <div>
      {step === 1 ? <Wellcome nextStep={setStep}/> : <RegisterForm previousStep={setStep}/>}
    </div>
  )
}

export default Register