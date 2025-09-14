const priceRegex = /([$€£])?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;

document.body.addEventListener("mouseover", (e) => {
    if (!e.target || !e.target.innerText) {
        return;
    }

    const el = e.target;
    let priceFound = null;
    let symbol = null;
    let whole = null;

    // Checking for Amazon's specific price element class
    if (el.classList.contains("a-price-whole")) {
        whole = el.innerText.replace(/[^\d]/g, "");
        const fractionEl = el.parentElement.querySelector(".a-price-fraction");
        const fraction = fractionEl ? fractionEl.innerText : "00";
        const symbolEl = el.parentElement.querySelector(".a-price-symbol");
        symbol = symbolEl ? symbolEl.innerText : "$";

        priceFound = {
            fullPrice: `${symbol}${whole}.${fraction}`,
            symbol: symbol,
            amount: `${whole}.${fraction}`
        };
    } else {
        // Fallback to the general regex for other websites.
        const match = el.innerText.match(priceRegex);
        if (match) {
            console.log("Inner Text", el.innerText);
            priceFound = {
                fullPrice: match[0] || "",
                symbol: match[1] || "$",
                amount: el.innerText.slice(1)
            }
        }
    }

    if (priceFound) {
        // priceFound will be used for currency conversion
        console.log("Price detected:", priceFound);

        // TODO: Add logic here to display the converted price.
        
    } else {
        console.log("No price found");
    }
});