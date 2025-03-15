import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import React from "react";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1pt solid #ccc",
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLogo: {
    width: 120,
  },
  headerText: {
    fontSize: 10,
    color: "#666",
    textAlign: "right",
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  content: {
    fontSize: 10,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  dateText: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: "right",
  },
  section: {
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    borderTop: "1pt solid #ccc",
    paddingTop: 10,
  },
  signature: {
    marginTop: 50,
    fontSize: 10,
  },
  signatureLine: {
    width: 200,
    borderBottom: "1pt solid #000",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: "bold",
    fontSize: 10,
  },
  value: {
    flex: 1,
    fontSize: 10,
  },
  diagnosticDetails: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
});

// Create PDF document
const ReferralPDF = ({ referralData, patientData, diagnosisData }) => {
  const today = new Date();
  const formattedDate = `${today.getDate()}/${
    today.getMonth() + 1
  }/${today.getFullYear()}`;

  // Extract diagnosis details
  const selectedDiagnosis = diagnosisData.find(
    (d) => d.Diagnosis === referralData.selectedDiagnosis
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                ABC GP Clinic
              </Text>
            </View>
            <View style={styles.headerText}>
              <Text>ABC GP Clinic</Text>
              <Text>123 Healthcare Way</Text>
              <Text>Medical District, MD 12345</Text>
              <Text>Tel: (+65) 1234 5678)</Text>
            </View>
          </View>
        </View>

        {/* Date */}
        <View>
          <Text style={styles.dateText}>Referral Date: {formattedDate}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>DERMATOLOGY REFERRAL LETTER</Text>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.content}>
            I am referring {referralData.name} to your clinic for further
            evaluation of suspected {referralData.selectedDiagnosis}. I would
            appreciate your expert assessment and management recommendations for
            this patient. Please see patient for follow up.
          </Text>
        </View>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>PATIENT INFORMATION</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{referralData.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{referralData.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{referralData.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>
              {patientData.dateOfBirth
                ? patientData.dateOfBirth.format("DD/MM/YYYY")
                : "Not provided"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>
              {patientData.gender || "Not provided"}
            </Text>
          </View>
          {patientData.race && (
            <View style={styles.row}>
              <Text style={styles.label}>Race:</Text>
              <Text style={styles.value}>{patientData.race}</Text>
            </View>
          )}
        </View>

        {/* Clinical Information */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>CLINICAL DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Onset Date:</Text>
            <Text style={styles.value}>
              {patientData.onset
                ? patientData.onset.format("DD/MM/YYYY")
                : "Not provided"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>
              {patientData.duration || "Not provided"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lesion Location:</Text>
            <Text style={styles.value}>
              {patientData.location || "Not provided"}
            </Text>
          </View>
          {patientData.itch && (
            <View style={styles.row}>
              <Text style={styles.label}>Symptoms:</Text>
              <Text style={styles.value}>{patientData.itch}</Text>
            </View>
          )}
        </View>

        {/* Medical Background - Only included if at least one field has content */}
        {(patientData.pastMedicalHistory ||
          patientData.familyHistory ||
          patientData.otherPertinentHistory) && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>MEDICAL BACKGROUND</Text>
            {patientData.pastMedicalHistory && (
              <View style={styles.row}>
                <Text style={styles.label}>Past Medical History:</Text>
                <Text style={styles.value}>
                  {patientData.pastMedicalHistory}
                </Text>
              </View>
            )}
            {patientData.familyHistory && (
              <View style={styles.row}>
                <Text style={styles.label}>Family History:</Text>
                <Text style={styles.value}>{patientData.familyHistory}</Text>
              </View>
            )}
            {patientData.otherPertinentHistory && (
              <View style={styles.row}>
                <Text style={styles.label}>Other History:</Text>
                <Text style={styles.value}>
                  {patientData.otherPertinentHistory}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Primary Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>PRIMARY DIAGNOSIS</Text>
          <Text style={styles.content}>
            Based on the submitted images and patient history, findings are
            suspected to be: 
            <Text style={{ fontWeight: "bold" }}>
              {referralData.selectedDiagnosis}
            </Text>
          </Text>
        </View>

        {/* Conclusion */}
        <View style={styles.section}>
          <Text style={styles.content}>
            Please do not hesitate to contact me if you require further
            information. I look forward to your evaluation and recommendations.
            Thank you for your attention to this referral.
          </Text>
          <Text>Yours sincerely,</Text>
          <Text>John Doe</Text>
          <Text>General Practitioner</Text>
          <Text>ABC GP Clinic</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            CONFIDENTIAL: This document contains protected health information.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReferralPDF;
