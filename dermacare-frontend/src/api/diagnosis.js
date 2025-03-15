const API_BASE_URL = 'http://localhost:5000';

export const generateDiagnosis = async (image, patientHistory) => {
  try {
    const formPayload = new FormData();
    formPayload.append("image", image);
    formPayload.append("patient_history", JSON.stringify(patientHistory));

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formPayload,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get diagnosis');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Diagnosis request failed: ${error.message}`);
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
};
