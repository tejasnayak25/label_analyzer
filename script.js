import { Client } from "@gradio/client";

let analyzeBtn = document.getElementById("analyzeBtn");
const termsCheckbox = document.getElementById('terms');
termsCheckbox.checked = false;

termsCheckbox.addEventListener('change', () => {
  if (termsCheckbox.checked) {
    analyzeBtn.classList.remove('cursor-not-allowed');
    analyzeBtn.removeAttribute('disabled');
  } else {
    analyzeBtn.classList.add('cursor-not-allowed');
    analyzeBtn.setAttribute('disabled', 'disabled');
  }
});
						
const client = await Client.connect("gokaygokay/Florence-2");

const chatclient = await Client.connect("hysts/zephyr-7b");

let picture = document.getElementById("picture");
let chosenImg = document.getElementById("chosenImg");
let output = document.getElementById("output");
let scanBtn = document.getElementById("scan")

scanBtn.onclick = () => {
    picture.click();
}

let pictureData = "";

picture.onchange = async (e) => {
    scanBtn.lastElementChild.innerText = "Parsing...";
    let url = URL.createObjectURL(e.target.files[0]);
    chosenImg.src = url;
    if(chosenImg.classList.contains("hidden")) {
        chosenImg.classList.remove("hidden");
    }
    const result = await client.predict("/process_image", { 
            image: e.target.files[0], 		
            task_prompt: "OCR", 		
            
            model_id: "microsoft/Florence-2-large-ft", 
    });

    

    // let str = ocr['<OCR>'];
    pictureData = result.data[0];

    scanBtn.lastElementChild.innerText = "Change";
}

analyzeBtn.onclick = async () => {
    output.innerText = "Analyzing...";

    const analyzeresult = await chatclient.predict("/chat", {
        message: `Analyze given label data and tell whether product is good for health, it's long-term and short-term effects. Make it brief, attractive, reader-friendly: ${pictureData}`, 		
		system_prompt: "", 		
		max_new_tokens: 2048, 		
		temperature: 0.1, 		
		top_p: 0.05, 		
		top_k: 1, 		
		repetition_penalty: 1
    });

    output.innerText = analyzeresult.data[0];
}