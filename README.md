[<img src="https://github.com/user-attachments/assets/c4049812-f85f-4300-b1da-8b86f4987d74">](https://dermacare-gilt.vercel.app/)

<h4 align="center">
  <a href="https://youtu.be/aN6GkPjVOqg">Youtube</a>
  <span> · </span>
  <a href="https://www.canva.com/design/DAGfqoK78Lo/qahyEYLsX1PhgaY6KXn-hQ/view?utm_content=DAGfqoK78Lo&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h27de641530">Pitch Deck</a>
</h4>

---

## DermaCare
Welcome to **DermaCare**, the innovative AI dermatology assistant designed for General Practitioners (GPs)!

It empowers GPs to accurately identify common skin conditions in primary care—without needing specialized training—by providing evidence-based, explainable insights in seconds. This enables confident, timely diagnoses and, when necessary, prompt referrals to dermatologists. By building patient trust and encouraging GPs to manage dermatologic consultations, DermaCare lowers healthcare costs with accurate, timely treatments while improving care quality by reducing unnecessary specialist referrals. In a value-based healthcare system, DermaCare shows how smart digital tools can both cut costs and enhance patient care.

> Try it out! [**DermaCare Functional Web App!**](https://dermacare-gilt.vercel.app/)

## Clinical Workflow
Our solution employs a hybrid AI analysis approach with two key inputs: 1) Dermatological image upload and 2) Patient history. This comprehensive data collection ensures more accurate analysis.

Importantly, the GP always maintains control, reviewing the AI insights to make the final diagnosis. From there, the management path is clear:
- For low-risk conditions where the system has high confidence, GPs can offer appropriate treatment immediately.
- For high-risk conditions or diagnoses with low confidence, DermaCare facilitates rapid specialist referrals through blue letters.

This streamlined workflow helps reduce unnecessary referrals while ensuring patients who need specialized care receive it promptly.

## Technologies Involved
![Overview](https://github.com/user-attachments/assets/1e44a3a9-9969-48e7-a5a3-a72748f45add)

## InterSystems Challenge
#### InterSystems Overview
    .
    ├── ..             
    ├── dermacare-backend      # Where the InterSystems IRIS Vector Search magic happens
    │   ├── notebooks
    │   ├──   ├── ..               
    │   ├──   └── setup.ipynb  # 1. Set up the persistent IRIS VectorDB with 2gb Dermnet dataset (20,000 images)   
    │   ├── dermacare-flask
    │   ├──   ├── ..               
    │   ├──   └── app.py       # 2. Query the existing IRIS VectorDB to conduct image vector search 
    └── dermacare-frontend

#### Setup
1. Open Docker
2. cd into `dermacare-backend`
3. Run the following command:

``` 
docker run -d --name iris-comm -p 1972:1972 -p 52773:52773 -e IRIS_PASSWORD=demo -e IRIS_USERNAME=demo intersystemsdc/iris-community:latest
```

4. Create a Python virtual environment

```
python -m venv iris-env
```

5. Run the Python virtual environemtn

```
.\iris-env\Scripts\Activate
```

6. Install dependencies

```
pip install -r requirements.txt
```

```
pip install ./install/intersystems_irispython-5.0.1-8026-cp38.cp39.cp310.cp311.cp312-cp38.cp39.cp310.cp311.cp312-win_amd64.whl
```

7. Run the jupyter notebook for setup
`jupyter notebook`

8. Follow the instrunctions in `notebooks/setup.ipynb`

9. cd into `dermcare-flask`

10. Create a `.env` file using the `.env.example` file. Fill in your OpenAI API Key

11. Run the app.py file
```
python3 app.py
```


#### How InterSystems IRIS Vector Search was used
1. First, we embedded 20,000 curated DermNet images in the IRIS Vector Database (VectorDB). This persistent VectorDB can be used to be queried subsequently.
2. When a GP uploads the patient's dermatological image, an image vector search is conducted and the top three similar diagnoses based on images in the VectorDB is returned.
3. This information, along with patient notes and the original image, are then processed via ChatGPT to deliver an accurate referral diagnosis, streamlining the entire workflow.


## About Us
- [Tan Hun Chong](https://www.linkedin.com/in/tanhunchong/): Team Lead
- [Rachel Lim](https://www.linkedin.com/in/rachellimruien/): Tech Lead
- [Yeo Jia Ying](https://www.linkedin.com/in/jia-ying-yeo-a71779289/): Medical Consultant
- [Xavier Wong](https://www.linkedin.com/in/xavierwongzh/): Business Strategist
- [Tan Shin Herng](https://www.linkedin.com/in/shinherng/): Data Analyst

For any queries, feel free to contact us [here](mailto:hunchong_tan@mymail.sutd.edu.sg).

## Acknowledgements
DermaCare is an undertaking of the [NUS HealthHack 2025 hackathon](https://healthhack.sg/), and HealthHack 2025’s [InterSystems Challenge](https://developer.intersystems.com/intersystems-genai-challenge-nus-health-hack/).
