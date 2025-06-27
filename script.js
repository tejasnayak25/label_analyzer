let analyzeBtn = document.getElementById("analyzeBtn");
const termsCheckbox = document.getElementById('terms');
termsCheckbox.checked = false;

let mode = "label";

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
    title: "Food Analyzer",
    text: "Scan your labels and food and let AI help you understand it.",
    url: location.href
  };
  if(navigator.canShare(data)) {
    navigator.share(data);
  }
}

let picture = document.getElementById("picture");
let chosenImg = document.getElementById("chosenImg");
let output = document.getElementById("output");
let scanBtn = document.getElementById("scan");
let product_name = document.getElementById("prodname");

scanBtn.onclick = () => {
    picture.click();
}

picture.onchange = async (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    chosenImg.src = url;

    if(chosenImg.classList.contains("hidden")) {
        chosenImg.classList.remove("hidden");
    }
}

let instructions = {
  "label": `You are an expert in nutrition and food safety. Carefully analyze the provided food label data and assess the overall healthiness of the product. 
- Summarize the main ingredients and nutritional highlights.
- Clearly identify any potential health risks, allergens, or notable benefits.
- Discuss possible short-term and long-term health effects.
- Use clear, concise language with bullet points and relevant unicode icons for better readability.
- Make the summary engaging, easy to understand, and actionable for everyday consumers.
Format: Product Name='$product_name'`,
  "food": `You are a nutrition and food safety expert. Analyze the given picture of food and determine if the product is healthy.
- Briefly summarize key observations.
- Highlight health benefits or concerns, including short-term and long-term effects.
- Use unicode icons and bullet points for clarity.
- Make the summary concise, visually appealing, and easy to read.`,
};

analyzeBtn.onclick = async () => {
    if(product_name.value === "" && mode === "label") {
      return;
    }
    
    output.mdContent = "Analyzing...";

    outputSection.classList.replace('hidden', 'flex');

    let analyzeresult;
    let file = picture.files[0];
    if(mode === "food" && picture.files.length > 0) {
      let formData = new FormData();
      formData.append("prompt", instructions[mode]);
      formData.append("image", file);

      analyzeresult = await fetch("/generate", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        return { data: [data.response] };
      })
      .catch(error => {
        console.error("Error:", error);
        return "Error: " + error.message;
      });
    } else if(mode === "label") {
      let formData = new FormData();
      formData.append("prompt", instructions[mode].replace("$product_name", product_name.value));
      formData.append("image", file);

      analyzeresult = await fetch("/generate", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        return { data: [data.response] };
      })
      .catch(error => {
        console.error("Error:", error);
        return "Error: " + error.message;
      });
    }

    output.mdContent = analyzeresult.data[0];
}

document.querySelectorAll("[name='list-radio']").forEach(inp => {
  inp.addEventListener('change', (e) => {
    const selected = document.querySelector("[name='list-radio']:checked");
    if (selected) {
      mode = selected.value;
      if(mode === "label") {
        product_name.parentElement.classList.replace('hidden', 'flex');
      } else {
        product_name.parentElement.classList.replace('flex', 'hidden');
      }
    }
  });
});