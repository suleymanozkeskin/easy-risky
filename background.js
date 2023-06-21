// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getRiskManagement') {
      chrome.storage.sync.get(['walletBalance', 'riskPerTrade', 'riskType'], (preferences) => {
        sendResponse(preferences);
      });
      return true; 
    }
  });
  