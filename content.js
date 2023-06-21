// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'setRiskManagement') {
      const preferences = request.preferences;
      setupListeners();
    }
  });
  
  function getPositionDetails() {
    const stopLossSelector = '#stopLossStopPrice-749';
    const entryPriceSelector = '#takeProfitStopPrice-496';
    const leverageSelector = "#__APP > div:nth-child(1) > div:nth-child(3) > div > div > div.react-grid-layout.layout > div.react-grid-item.react-draggable.react-draggable-dragging.cssTransforms.react-resizable > div > div.css-1ma0998 > div.flex-row.margin-leverage-or-title-row > div > a:nth-child(2) > div > div > span";
  
    const stopLoss = parseFloat(document.querySelector(stopLossSelector).value);
    const leverage = parseFloat(document.querySelector(leverageSelector).innerText);
    const entryPrice = parseFloat(document.querySelector(entryPriceSelector).value);
    const tradeDirection = stopLoss > entryPrice ? 'short' : 'long';
  
    return {
      stopLoss,
      leverage,
      entryPrice,
      tradeDirection
    };
  }
  
  function calculateTradeAmount(preferences, positionDetails) {
    const { walletBalance, riskPerTrade, riskType } = preferences;
    const { stopLoss, leverage, entryPrice, tradeDirection } = positionDetails;
  
    let riskAmount;
    if (riskType === 'percentage') {
      riskAmount = walletBalance * (riskPerTrade / 100);
    } else {
      riskAmount = riskPerTrade;
    }
  
    const tradeAmount = (riskAmount * leverage) / (entryPrice * stopLoss);
  
    return tradeAmount;
  }
  
  function adjustTrade(tradeAmount) {
    const tradeAmountInputSelector = '#unitAmount-515';
  
    const tradeAmountInput = document.querySelector(tradeAmountInputSelector);
  
    tradeAmountInput.value = tradeAmount.toFixed(8);
  
    const event = new Event('change', { bubbles: true });
    tradeAmountInput.dispatchEvent(event);
  }
  
  function setupListeners() {
    const stopLossSelector = '#stopLossStopPrice-749';
    const entryPriceSelector = '#takeProfitStopPrice-496';
  
    const stopLossInput = document.querySelector(stopLossSelector);
    const entryPriceInput = document.querySelector(entryPriceSelector);
  
    stopLossInput.addEventListener('change', handleUserInput);
    entryPriceInput.addEventListener('change', handleUserInput);
  }
  
  function handleUserInput() {
    chrome.runtime.sendMessage({ action: 'getRiskManagement' }, (preferences) => {
      const positionDetails = getPositionDetails();
      const tradeAmount = calculateTradeAmount(preferences, positionDetails);
      console.log('Calculated trade amount:', tradeAmount); 
      adjustTrade(tradeAmount);
    });
  }
  