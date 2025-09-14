const priceRegex = /([$€£])?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;

let targetCurrency = "BDT";

document.body.addEventListener("mouseover", async (e) => {
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
        // Fallback to the general regex for other websites. Works for Walmart
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
        try {
            const response = await fetch(`http://localhost:3000/convert?from=USD&to=${targetCurrency}`);
            const data = response.data;

            if (data.converted) {
                createToolTip(el, `BDT ${data.converted}`);
            }
        } catch (err) {
            console.error("Conversion error", err);
        }
        
    } else {
        console.log("No price found");
    }

    /**
     * remove oldtooltip
     * create new tooltip (a div)
     * set an id
     * set inner text
     * 
     * style
     * position: absolute
     * bg: black
     * color: white
     * padding: 2 6
     * borderRadius: 4
     * fontSize: 12
     * zIndex: 9999
     * 
     * position near mouse
     * getBoundingClientRect
     * tooltip styling top and left
     */

    function createToolTip(target, text) {
       let oldToolTip = document.querySelector('#currency-tooltip');
       if (oldToolTip) oldToolTip.remove();

       const tooltip = document.createElement('div');
       tooltip.id = "currency-tooltip";
       tooltip.innerText = text;

       tooltip.style.position = 'absolute';
       tooltip.style.background = 'black';
       tooltip.style.color = 'white';
       tooltip.style.padding = "2px 6px";
       tooltip.style.borderRadius = '4px';
       tooltip.style.fontSize = '12px';
       tooltip.style.zIndex = '9999';

       const rect = target.getBoundingClientRect();
       tooltip.style.top = `${rect.top + window.scrollY - 25}px`;
       tooltip.style.left = `${rect.left + window.scrollX}px`;

       document.body.appendChild(tooltip);
    }
});