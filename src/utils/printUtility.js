// src/utils/printUtility.js
export const printSheetComponent = (elementId) => {
  const printContents = document.getElementById(elementId).innerHTML;
  const originalContents = document.body.innerHTML;
  
  // Isolate document styles and render specific container
  document.body.innerHTML = `
    <html>
      <head>
        <title>Expense Claim Export</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .no-print { display: none; }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Restores full interactive application context
};