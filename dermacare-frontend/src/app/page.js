import ActionSection from "@/components/ActionSection";
import DiagnosisSection from "@/components/DiagnosisSection";
import InputSection from "@/components/InputSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <div className="flex gap-5 justify-start ">
        <InputSection />
        <DiagnosisSection/>
        <ActionSection />
      </div>
    </div>
  );
}
