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

let outputSection = document.getElementById('output-section');

document.getElementById("hide-output").onclick = () => {
  outputSection.classList.replace('flex','hidden');
}

document.getElementById("share-btn").onclick = () => {
  let data = {
    title: "Label Padhega AI",
    text: "Scan your food labels and let AI help you understand it.",
    url: location.href
  };
  if(navigator.canShare(data)) {
    navigator.share(data);
  }
}
						
const imgclient = await Client.connect("gokaygokay/Florence-2");

const chatclient = await Client.connect("Be-Bo/llama-3-chatbot_70b");

let picture = document.getElementById("picture");
let chosenImg = document.getElementById("chosenImg");
let output = document.getElementById("output");
let scanBtn = document.getElementById("scan");
let product_name = document.getElementById("prodname");

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
    const result = await imgclient.predict("/process_image", { 
      image: e.target.files[0], 		
      task_prompt: "OCR", 		
      text_input: "", 		
      model_id: "microsoft/Florence-2-base-ft", 
    });

    // let str = ocr['<OCR>'];
    pictureData = result.data[0];

    scanBtn.lastElementChild.innerText = "Change";
}

analyzeBtn.onclick = async () => {
    if(product_name.value === "") {
      return;
    }
    
    output.mdContent = "Analyzing...";

    outputSection.classList.replace('hidden', 'flex');

    const analyzeresult = await chatclient.predict("/chat", {
        message: `Analyze given label data and tell whether product is good for health, long-term and short-term effects. Use unicode icons. Make it brief, neat, attractive, reader-friendly: Name='${product_name.value}', ${pictureData}`,
    });

    output.mdContent = analyzeresult.data[0];
}