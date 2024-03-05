let Purchase_Price = 175500;
let Downpayment = 20 / 100;
let Interest_Rate = 8 / 100;
let Mortgage_Years = 30;
let Projected_Rent = 1293;
let Rent_Increase_Rate = 3.3 / 100
let Vacancy_Rate = .04;
let Taxes_and_insurance = .03;
let Property_Mgnt = .03;
let Appreciation_Rate = 0.0575;

const property_taxes = 678;
const homeowners_insurance = 672;
const property_mgmt_fee = 986;
const cost_of_vacancy = 99;
const maintenance_repairs = 962;


// Utilitiy functions
function calculateFV(rate, nper, pmt, pv, type) {
    var fv = pv * Math.pow(1 + rate, nper);
    if (type === 1) {
        fv += pmt * ((Math.pow(1 + rate, nper) - 1) / rate);
    } else {
        fv += pmt * ((Math.pow(1 + rate, nper) - 1) / rate) * (1 + rate);
    }

    return fv;
}

function calculateMonthlyMortgagePayment(interestRate, loanTermInYears, loanAmount) {
    // Convert annual interest rate to monthly rate
    const monthlyInterestRate = interestRate / 12;

    const numberOfPayments = loanTermInYears * 12;

    const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
        return "";
    }

    return monthlyPayment.toFixed(2);
}


let Downpayment_Amnt = Purchase_Price * Downpayment
let Finance_Amnt = Purchase_Price - Downpayment_Amnt
let Mortgage_Payment = calculateMonthlyMortgagePayment(Interest_Rate, Mortgage_Years, Finance_Amnt)

// console.log("Downpayment_Amnt amnt",Downpayment_Amnt);
// console.log("Monthly Mortgage Payment:", Mortgage_Payment);



let Annual_Rental_Income = [Projected_Rent * 12]
let Home_Price_Apriciation = []
let Total_Annual_Return_Investment = []


// Home appriciation
for (let i = 1; i < 31; i++) {
    Home_Price_Apriciation.push(calculateFV(Appreciation_Rate, i, 0, Purchase_Price, 1) - Purchase_Price)

}

// annual rental
for (let i = 1; i < Mortgage_Years; i++) {
    Annual_Rental_Income.push((1 + Rent_Increase_Rate) * Annual_Rental_Income[i - 1])

}


//   total annual 
for (let i = 0; i < Home_Price_Apriciation.length; i++) {
    Total_Annual_Return_Investment.push(Home_Price_Apriciation[i] + Annual_Rental_Income[i])

}


const expenses = {
    "Mortgage_Payment": [Mortgage_Payment * 12],
    "Property_Taxes": [property_taxes],
    "Homeowners_Insurance": [homeowners_insurance],
    "Property_Management_Fee": [property_mgmt_fee],
    "Cost_of_Vacancy": [cost_of_vacancy],
    "Maintenance_&_Repairs": [maintenance_repairs],
    "Total_Annual_Expenses": []
};

expenses["Total_Annual_Expenses"].push(expenses["Mortgage_Payment"][0] + expenses["Property_Taxes"][0] + expenses["Homeowners_Insurance"][0] + expenses["Property_Management_Fee"][0] + expenses["Cost_of_Vacancy"][0] + expenses["Maintenance_&_Repairs"][0])


for (let i = 1; i < 31; i++) {
    expenses["Mortgage_Payment"].push(expenses["Mortgage_Payment"][i - 1])
    expenses["Property_Taxes"].push((Taxes_and_insurance + 1) * expenses["Property_Taxes"][i - 1])
    expenses["Homeowners_Insurance"].push((Taxes_and_insurance + 1) * expenses["Homeowners_Insurance"][i - 1])
    expenses["Property_Management_Fee"].push((Property_Mgnt + 1) * expenses["Property_Management_Fee"][i - 1])
    expenses["Cost_of_Vacancy"].push((Vacancy_Rate + 1) * expenses["Cost_of_Vacancy"][i - 1])
    expenses["Maintenance_&_Repairs"].push(expenses["Maintenance_&_Repairs"][i - 1])
    expenses["Total_Annual_Expenses"].push(expenses["Mortgage_Payment"][i] + expenses["Property_Taxes"][i] + expenses["Homeowners_Insurance"][i] + expenses["Property_Management_Fee"][i] + expenses["Cost_of_Vacancy"][i] + expenses["Maintenance_&_Repairs"][i])


}

let anual_rental_cashflow_after_expenses = []
let Total_Return_on_Investment = []
for (let i = 0; i < 15; i++) {
    anual_rental_cashflow_after_expenses.push(Annual_Rental_Income[i] - expenses["Total_Annual_Expenses"][i])
    Total_Return_on_Investment.push(Total_Annual_Return_Investment[i] - expenses["Total_Annual_Expenses"][i])
}



const property_cashflow = [Purchase_Price]


for (let i = 1; i < 31; i++) {
    property_cashflow.push(Annual_Rental_Income[i] - expenses["Total_Annual_Expenses"][i])

}

console.log(anual_rental_cashflow_after_expenses);
console.log(Total_Return_on_Investment)
var table = document.getElementById("investmentTable");
var table2 = document.getElementById("investmentTableexpenss");
var table3 = document.getElementById("investmentTable3");
var table4 = document.getElementById("table4");


function formatMoneyWithSeparator(amount) {
    // Ensure the input is a number
    if (typeof amount !== 'number') {
        return 'Invalid input';
    }

    // Round the amount to two decimal places
    const roundedAmount = amount

    // Add commas as thousands separators and format with two decimal places
    return roundedAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}


function populateTable1() {

    let tbody = document.getElementById("table1body");
    tbody.innerHTML = ""; // Clear the existing table body

    for (let i = 0; i < 15; i++) {
        let row = document.createElement("tr")
        row.innerHTML = `
          <td>${i + 1}</td>
          <td> ${formatMoneyWithSeparator(Math.round(expenses["Mortgage_Payment"][i]))}</td>
          <td> ${formatMoneyWithSeparator(Math.round(expenses["Property_Taxes"][i]))}</td>
          <td> ${formatMoneyWithSeparator(Math.round(expenses["Homeowners_Insurance"][i]))}</td>
          <td> ${formatMoneyWithSeparator(Math.round(expenses["Property_Management_Fee"][i]))}</td>
          <td> ${formatMoneyWithSeparator(Math.round(expenses["Cost_of_Vacancy"][i]))}</td>
          <td> ${formatMoneyWithSeparator(Math.round(expenses["Maintenance_&_Repairs"][i]))}</td>
          <td> ${formatMoneyWithSeparator(Math.round(expenses["Total_Annual_Expenses"][i]))}</td>
      `;
        // log
        tbody.appendChild(row);
    }
}

function populateTable2() {

    let tbody = document.getElementById("table2body");
    tbody.innerHTML = ""; // Clear the existing table body

    for (let i = 0; i < 15; i++) {
        let row = document.createElement("tr")
        row.innerHTML = `
      
      <td>${i + 1}</td>
      

          <td> ${formatMoneyWithSeparator(Math.round(Annual_Rental_Income[i]))}</td>
       

          <td> ${formatMoneyWithSeparator(Math.round(Annual_Rental_Income[i]))}</td>
       

          <td> ${formatMoneyWithSeparator(Math.round(Home_Price_Apriciation[i]))}</td>
       

          <td> ${formatMoneyWithSeparator(Math.round(Total_Annual_Return_Investment[i]))}</td>
       
        
      `;
        // log
        tbody.appendChild(row);
    }
}

function populateTable3() {
    let tbody = document.getElementById("table3body");
    tbody.innerHTML = ""; // Clear the existing table body

    for (let i = 0; i < 15; i++) {
        let row = document.createElement("tr")
        row.innerHTML = `
          <td>${i + 1}</td>
          <td> ${formatMoneyWithSeparator(Math.round(anual_rental_cashflow_after_expenses[i]))}</td>
          <td> ${formatMoneyWithSeparator(Math.round(Total_Return_on_Investment[i]))}</td>
      `;
        // log
        tbody.appendChild(row);
    }
}

function populateTable4() {
    let tbody = document.getElementById("table4body");
    tbody.innerHTML = ""; // Clear the existing table body
    for (let i = 0; i < 15; i++) {
        let row = document.createElement("tr")

        row.innerHTML = `
      <tr class='border'>${i + 1} year</tr>
          <td class='w-25'> ${formatMoneyWithSeparator(Math.round(property_cashflow[i]))}</td>
      `;
        // log
        tbody.appendChild(row);
    }
}




// Call the function to populate the table


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btns = Array.from(document.getElementsByClassName("irr_toggleTable"))
console.log(btns)
// When the user clicks the button, open the modal
function openModal() {
    console.log("button clicked irrr");
    // // Run the functions to populate the tables
    populateTable1();
    populateTable2();
    populateTable3();
    populateTable4();
    // document.getElementById("table3body").innerHTML = `hiii`
    // console.log(document.getElementById("table3body").innerHTML );
    modal.style.display = "block";
}
btns.forEach((btn)=>{
    btn.addEventListener("click",openModal)
})
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Get the close button inside the modal
var closeButton = document.querySelector(".close");

// Function to handle closing the modal
function closeModal() {
  modal.style.display = "none";
}

// Attach click event listener to the close button
closeButton.addEventListener("click", closeModal);



