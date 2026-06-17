function getValue(item, camelCaseKey, excelKey) {
  return item[camelCaseKey] ?? item[excelKey];
}

function toNumber(value) {
  return Number(value) || 0;
}

function formatMoney(value) {
  return "$" + toNumber(value).toFixed(2);
}

function calculateDashboard() {
  const totalRevenue = salesData.reduce((sum, item) => {
    return sum + toNumber(getValue(item, "totalPrice", "TotalPrice"));
  }, 0);

  const totalOrders = salesData.length;

  const totalQuantity = salesData.reduce((sum, item) => {
    return sum + toNumber(getValue(item, "quantity", "Quantity"));
  }, 0);

  const regionSales = {};

  salesData.forEach(item => {
    const region = getValue(item, "region", "Region");
    const totalPrice = toNumber(getValue(item, "totalPrice", "TotalPrice"));

    if (!regionSales[region]) {
      regionSales[region] = 0;
    }

    regionSales[region] += totalPrice;
  });

  let topRegion = "-";
  let highestSales = 0;

  for (let region in regionSales) {
    if (regionSales[region] > highestSales) {
      highestSales = regionSales[region];
      topRegion = region;
    }
  }

  const totalRevenueElement = document.getElementById("totalRevenue");
  const totalOrdersElement = document.getElementById("totalOrders");
  const totalQuantityElement = document.getElementById("totalQuantity");
  const topRegionElement = document.getElementById("topRegion");

  if (totalRevenueElement) totalRevenueElement.textContent = formatMoney(totalRevenue);
  if (totalOrdersElement) totalOrdersElement.textContent = totalOrders;
  if (totalQuantityElement) totalQuantityElement.textContent = totalQuantity;
  if (topRegionElement) topRegionElement.textContent = topRegion;
}

function loadProductTable() {
  const productTable = document.getElementById("productTable");

  if (!productTable) return;

  productTable.innerHTML = "";

  const productData = {};

  salesData.forEach(item => {
    const product = getValue(item, "product", "Product");
    const quantity = toNumber(getValue(item, "quantity", "Quantity"));
    const totalPrice = toNumber(getValue(item, "totalPrice", "TotalPrice"));

    if (!productData[product]) {
      productData[product] = {
        quantity: 0,
        revenue: 0
      };
    }

    productData[product].quantity += quantity;
    productData[product].revenue += totalPrice;
  });

  for (let product in productData) {
    productTable.innerHTML += `
      <tr>
        <td>${product}</td>
        <td>${productData[product].quantity}</td>
        <td>${formatMoney(productData[product].revenue)}</td>
      </tr>
    `;
  }
}

function loadRegionTable() {
  const regionTable = document.getElementById("regionTable");

  if (!regionTable) return;

  regionTable.innerHTML = "";

  const regionData = {};

  salesData.forEach(item => {
    const region = getValue(item, "region", "Region");
    const totalPrice = toNumber(getValue(item, "totalPrice", "TotalPrice"));

    if (!regionData[region]) {
      regionData[region] = 0;
    }

    regionData[region] += totalPrice;
  });

  for (let region in regionData) {
    regionTable.innerHTML += `
      <tr>
        <td>${region}</td>
        <td>${formatMoney(regionData[region])}</td>
      </tr>
    `;
  }
}

calculateDashboard();
loadProductTable();
loadRegionTable();
