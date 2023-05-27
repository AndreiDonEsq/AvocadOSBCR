const cashbackBtn = document.getElementById("cashbackToggleButton");
document.addEventListener('DOMContentLoaded', function () {
    cashbackBtn.addEventListener("click", onCashbackToggle);
});


async function onCashbackToggle() {
    cashbackBtn.textContent = "Cashback ON";
}