
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let number = Number(localStorage.getItem("number")) || 1;

const form = document.getElementById("ticketForm");
const list = document.getElementById("ticketList");

function saveTickets() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
    localStorage.setItem("number", number);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function showTickets() {
    list.innerHTML = "";

    let search = document.getElementById("search").value.toLowerCase();

    let result = tickets.filter(ticket =>
        ticket.name.toLowerCase().includes(search) ||
        ticket.subject.toLowerCase().includes(search) ||
        ticket.ticketNo.toLowerCase().includes(search)
    );

    if (result.length === 0) {
        list.innerHTML = "<tr><td colspan='6'>No records found.</td></tr>";
    }

    result.forEach(ticket => {
        list.innerHTML += `
            <tr>
                <td>${escapeHTML(ticket.ticketNo)}</td>
                <td>${escapeHTML(ticket.name)}</td>
                <td>${escapeHTML(ticket.category)}</td>
                <td>${escapeHTML(ticket.subject)}</td>
                <td>${escapeHTML(ticket.status)}</td>
                <td>
                    <button class="edit" onclick="editTicket('${ticket.id}')">Edit</button>
                    <button class="delete" onclick="deleteTicket('${ticket.id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    updateDashboard();
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let ticket = {
        id: Date.now().toString(),
        ticketNo: "TK-" + String(number).padStart(3, "0"),
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        category: document.getElementById("category").value,
        subject: document.getElementById("subject").value.trim(),
        description: document.getElementById("description").value.trim(),
        status: "Pending"
    };

    tickets.push(ticket);
    number++;

    saveTickets();

    document.getElementById("message").textContent =
        "Ticket submitted successfully! Ticket No: " + ticket.ticketNo;

    form.reset();
    showTickets();
});

function editTicket(id) {
    let ticket = tickets.find(t => t.id === id);

    if (!ticket) return;

    let status = prompt(
        "Enter status: Pending, In Progress, or Resolved",
        ticket.status
    );

    if (status === null) return;

    let valid = ["Pending", "In Progress", "Resolved"];

    let selected = valid.find(
        s => s.toLowerCase() === status.trim().toLowerCase()
    );

    if (!selected) return;

    ticket.status = selected;

    saveTickets();
    showTickets();
}

function deleteTicket(id) {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    tickets = tickets.filter(t => t.id !== id);

    saveTickets();
    showTickets();
}

function updateDashboard() {
    document.getElementById("total").textContent = tickets.length;

    document.getElementById("pending").textContent =
        tickets.filter(t => t.status === "Pending").length;

    document.getElementById("resolved").textContent =
        tickets.filter(t => t.status === "Resolved").length;
}

document.getElementById("search").addEventListener("input", showTickets);

showTickets();
