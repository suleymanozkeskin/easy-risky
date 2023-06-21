const languageSelect = document.querySelector('#languageSelect');
languageSelect.addEventListener('change', () => {
  updateLanguage(languageSelect.value);
});

function updateLanguage(lang) {
  loadTranslations(lang);
  localStorage.setItem('language', lang);
}

function applyTranslations(translations) {
  for (const key in translations) {
    const element = document.getElementById(key);
    if (element) {
      if (element.tagName === 'OPTION') {
        element.value = translations[key].message;
      } else {
        element.textContent = translations[key].message;
      }
    }
  }
}


function loadTranslations(language) {
  const url = `_locales/${language}/messages.json`;
  fetch(url)
    .then((response) => response.json())
    .then((translations) => applyTranslations(translations))
    .catch((error) => console.error(`Error loading translations for ${language}: ${error}`));
}

document.getElementById("languageSelect").addEventListener("change", (event) => {
  const selectedLanguage = event.target.value;
  updateLanguage(selectedLanguage);
});

// Load user inputs and translations
const savedLanguage = localStorage.getItem("language") || "en";
document.getElementById("languageSelect").value = savedLanguage;
updateLanguage(savedLanguage);

document.getElementById('calculate').addEventListener('click', () => {
    const walletBalance = parseFloat(document.getElementById('walletBalance').value);
    const tradeType = document.getElementById('selectedTradeType').value;
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const stopLossPrice = parseFloat(document.getElementById('stopLossPrice').value);
    const takeProfitPrice = parseFloat(document.getElementById('takeProfitPrice').value);
  
    const results = calculateTrade(walletBalance, tradeType, entryPrice, stopLossPrice, takeProfitPrice);
  
    document.getElementById('positionSizeUnits').textContent = results.positionSizeUnits.toFixed(8);
    document.getElementById('positionSizeUSD').textContent = results.positionSizeUSD.toFixed(2);
    document.getElementById('riskRewardRatio').textContent = results.riskRewardRatio.toFixed(2);
    document.getElementById('rewardUSD').textContent = results.rewardUSD.toFixed(2);
    
    // Save user inputs
    localStorage.setItem('walletBalance', walletBalance);
    localStorage.setItem('tradeType', tradeType);
    localStorage.setItem('swingRiskType', document.getElementById('swingRiskType').value);
    localStorage.setItem('swingRiskPerTrade', document.getElementById('swingRiskPerTrade').value);
    localStorage.setItem('intradayRiskType', document.getElementById('intradayRiskType').value);
    localStorage.setItem('intradayRiskPerTrade', document.getElementById('intradayRiskPerTrade').value);
    localStorage.setItem('scalpRiskType', document.getElementById('scalpRiskType').value);
    localStorage.setItem('scalpRiskPerTrade', document.getElementById('scalpRiskPerTrade').value);
    localStorage.setItem('entryPrice', entryPrice);
    localStorage.setItem('stopLossPrice', stopLossPrice);
    localStorage.setItem('takeProfitPrice', takeProfitPrice);
  });
  
  function calculateTrade(walletBalance, tradeType, entryPrice, stopLossPrice, takeProfitPrice) {
    let riskType, riskPerTrade;
  
    switch (tradeType) {
      case 'swing':
        riskType = document.getElementById('swingRiskType').value;
        riskPerTrade = parseFloat(document.getElementById('swingRiskPerTrade').value);
        break;
      case 'intraday':
        riskType = document.getElementById('intradayRiskType').value;
        riskPerTrade = parseFloat(document.getElementById('intradayRiskPerTrade').value);
        break;
      case 'scalp':
        riskType = document.getElementById('scalpRiskType').value;
        riskPerTrade = parseFloat(document.getElementById('scalpRiskPerTrade').value);
        break;
      default:
        throw new Error('Invalid trade type');
    }
  
    let riskAmount;
    if (riskType === 'percentage') {
      riskAmount = walletBalance * (riskPerTrade / 100);
    } else {
      riskAmount = riskPerTrade;
    }
  
    const positionSizeUnits = riskAmount / Math.abs(entryPrice - stopLossPrice);
    const positionSizeUSD = positionSizeUnits * entryPrice;
  
    const riskRewardRatio = Math.abs((takeProfitPrice - entryPrice) / (entryPrice - stopLossPrice));
    const rewardUSD = riskRewardRatio * riskAmount;
  
    return {
      positionSizeUnits,
      positionSizeUSD,
      riskRewardRatio,
      rewardUSD
    };
  }
  
  
  // Load user inputs
  document.getElementById('walletBalance').value = localStorage.getItem('walletBalance') || '';
  document.getElementById('selectedTradeType').value = localStorage.getItem('tradeType') || 'swing';
  document.getElementById('swingRiskType').value = localStorage.getItem('swingRiskType') || 'percentage';
  document.getElementById('swingRiskPerTrade').value = localStorage.getItem('swingRiskPerTrade') || '';
  document.getElementById('intradayRiskType').value = localStorage.getItem('intradayRiskType') || 'usd';
  document.getElementById('intradayRiskPerTrade').value = localStorage.getItem('intradayRiskPerTrade') || '';
  document.getElementById('scalpRiskType').value = localStorage.getItem('scalpRiskType') || 'percentage';
  document.getElementById('scalpRiskPerTrade').value = localStorage.getItem('scalpRiskPerTrade') || '';
  document.getElementById('entryPrice').value = localStorage.getItem('entryPrice') || '';
  document.getElementById('stopLossPrice').value = localStorage.getItem('stopLossPrice') || '';
  document.getElementById('takeProfitPrice').value = localStorage.getItem('takeProfitPrice') || '';