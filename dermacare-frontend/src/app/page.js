"use client";
import { useState } from "react";
import ActionSection from "@/components/ActionSection";
import DiagnosisSection from "@/components/DiagnosisSection";
import InputSection from "@/components/InputSection";
import { message } from "antd";
import { generateDiagnosis } from "@/api/diagnosis";
import dayjs from "dayjs";
import ReferralSection from "@/components/ReferralSection";

export default function Home() {
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "Not provided";
  };

  const createPatientHistoryString = (values) => {
    const sections = [
      `Patient Information:
- Date of Birth: ${formatDate(values.dateOfBirth)}
- Gender: ${values.gender}
- Race: ${values.race}`,

      `Clinical Information:
- Onset Date: ${formatDate(values.onset)}
- Duration: ${values.duration || "Not provided"}
- Location: ${values.location || "Not provided"}
- Symptoms: ${
        values.itch ? `Patient reports ${values.itch}` : "No symptoms reported"
      }`,

      `Medical Background:
- Past Medical History: ${values.pastMedicalHistory || "None reported"}
- Family History: ${values.familyHistory || "None reported"}
- Other Pertinent History: ${values.otherPertinentHistory || "None reported"}`,
    ];

    return sections.join("\n\n");
  };

  const handleUploadChange = ({ fileList }) => {
    const limitedFileList = fileList.slice(0, 3);
    setFileList(limitedFileList);
  };

  const handleFormSubmit = async (values) => {
    const firstImage = fileList[0]?.originFileObj;
    if (!firstImage) {
      message.error("Please upload at least one image!");
      return;
    }

    setIsLoading(true);
    try {
      const patientHistoryString = createPatientHistoryString(values);
      setFormData({
        ...values,
        patientHistoryString,
      });

      const result = await generateDiagnosis(firstImage, patientHistoryString);
      setDiagnosisResult(result);
      message.success("Diagnosis completed successfully!");
    } catch (error) {
      message.error(error.message);
      setDiagnosisResult(null);
      setFormData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFileList([]);
    setFormData(null);
    setDiagnosisResult(null);
  };

  return (
    <div className="w-full">
      <div className="flex gap-5 justify-start">
        <InputSection
          fileList={fileList}
          onUploadChange={handleUploadChange}
          onFormSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
        <DiagnosisSection
          diagnosisResult={diagnosisResult}
          isLoading={isLoading}
          className="flex-1"
        />
        <div className="flex flex-col flex-1">
          <ActionSection onReset={handleReset} isLoading={isLoading} />
          <ReferralSection
            diagnosisResult={diagnosisResult}
            isLoading={isLoading}
            formData={formData}
          />
        </div>
      </div>
    </div>
  );
}