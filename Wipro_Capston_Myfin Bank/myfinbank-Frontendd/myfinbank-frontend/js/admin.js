/**
 * admin.js — Admin Pages Logic
 * =========================================
 *
 * Handles:
 *
 * 1. Customer Management
 * 2. Customer Search
 * 3. Activate / Deactivate Customers
 * 4. Pending Loan Loading
 * 5. Approve / Deny Loans
 *
 */

guardRoute("admin");

/*
=========================================
Detect Current Page
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const path =
        window.location.pathname;

    if (
        path.includes(
            "admin-customers"
        )
    ) {

        loadCustomers();

    }

    else if (
        path.includes(
            "admin-loans"
        )
    ) {

        loadPendingLoans();

    }

});


/*
=========================================
CUSTOMER MANAGEMENT
=========================================
*/

async function loadCustomers() {

    showLoader();

    try {

        /*
        GET /api/admin/customers
        */

        const customers =
            await getAllCustomers();


        const tbody =
            document.getElementById(
                "customer-table-body"
            );

        const empty =
            document.getElementById(
                "cust-empty"
            );


        if (
            !customers ||
            customers.length===0
        ){

            tbody.innerHTML="";

            empty.style.display=
                "block";

            return;
        }

        empty.style.display=
            "none";


        renderCustomers(
            customers
        );

    }

    catch(error){

        showToast(
            error.message ||
            "Unable to load customers",
            "error"
        );

    }

    finally{

        hideLoader();

    }

}


/*
=========================================
Render Customer Table
=========================================
*/

function renderCustomers(customers){

    const tbody =
        document.getElementById(
            "customer-table-body"
        );


    tbody.innerHTML=

    customers.map(c=>`

<tr id="cust-row-${c.id}">

<td style="font-family:monospace;color:var(--grey)">
#${c.id}
</td>

<td style="font-weight:500">
${c.fullName || c.username || "—"}
</td>

<td style="font-size:0.85rem;color:var(--grey)">
${c.email || "—"}
</td>

<td>

<span class="badge ${c.active
?"badge-success"
:"badge-danger"}">

${c.active
?"Active"
:"Inactive"}

</span>

</td>

<td>

${c.active

?`

<button
class="btn btn-danger btn-sm"
onclick="handleDeactivate(${c.id})">

Deactivate

</button>

`

:`

<button
class="btn btn-success btn-sm"
onclick="handleActivate(${c.id})">

Activate

</button>

`

}

</td>

</tr>

`).join("");

}


/*
=========================================
SEARCH CUSTOMER
=========================================
*/

async function handleCustomerSearch(){

    const keyword=

        document
        .getElementById(
            "customerSearchInput"
        )
        .value
        .trim();


    if(!keyword){

        showToast(
            "Enter customer ID, name or email",
            "error"
        );

        return;
    }


    showLoader();


    try{

        /*
        Calls:

        GET

        /api/admin/customers/search
        */

        const customers=

            await searchCustomers(
                keyword
            );


        const empty=
            document.getElementById(
                "cust-empty"
            );


        if(
            !customers ||
            customers.length===0
        ){

            empty.style.display=
                "block";

            document
            .getElementById(
                "customer-table-body"
            )
            .innerHTML="";

            return;

        }


        empty.style.display=
            "none";


        renderCustomers(
            customers
        );

    }

    catch(error){

        showToast(
            error.message ||
            "Search failed",
            "error"
        );

    }

    finally{

        hideLoader();

    }

}


/*
=========================================
RESET SEARCH
=========================================
*/

async function clearCustomerSearch(){

    document
    .getElementById(
        "customerSearchInput"
    )
    .value="";


    await loadCustomers();

}


/*
=========================================
DEACTIVATE CUSTOMER
=========================================
*/

async function handleDeactivate(id){

    if(
        !confirm(
            "Deactivate customer?"
        )
    ) return;


    showLoader();

    try{

        await deactivateCustomer(id);

        showToast(
            "Customer deactivated",
            "success"
        );

        await loadCustomers();

    }

    catch(error){

        showToast(
            error.message,
            "error"
        );

    }

    finally{

        hideLoader();

    }

}


/*
=========================================
ACTIVATE CUSTOMER
=========================================
*/

async function handleActivate(id){

    showLoader();

    try{

        await activateCustomer(id);

        showToast(
            "Customer activated",
            "success"
        );

        await loadCustomers();

    }

    catch(error){

        showToast(
            error.message,
            "error"
        );

    }

    finally{

        hideLoader();

    }

}


/*
=========================================
LOAD PENDING LOANS
=========================================
*/

async function loadPendingLoans(){

showLoader();

try{

const loans=
await getPendingLoans();

const tbody=
document.getElementById(
"loan-table-body"
);

const empty=
document.getElementById(
"loans-empty"
);

if(
!loans||
loans.length===0
){

empty.style.display=
"block";

return;

}

tbody.innerHTML=

loans.map(loan=>`

<tr id="loan-row-${loan.id}">

<td>#${loan.id}</td>

<td>
${loan.customerEmail || "—"}
</td>

<td>
${formatCurrency(
loan.loanAmount
)}
</td>

<td>

<button
class="btn btn-success btn-sm"
onclick="handleApproveLoan(${loan.id})">

Approve

</button>

<button
class="btn btn-danger btn-sm"
onclick="handleDenyLoan(${loan.id})">

Deny

</button>

</td>

</tr>

`).join("");

}

catch(error){

showToast(
error.message,
"error"
);

}

finally{

hideLoader();

}

}


/*
=========================================
LOAN ACTIONS
=========================================
*/

async function handleApproveLoan(id){

await approveLoan(id);

showToast(
"Loan Approved",
"success"
);

loadPendingLoans();

}

async function handleDenyLoan(id){

await denyLoan(id);

showToast(
"Loan Denied",
"info"
);

loadPendingLoans();

}