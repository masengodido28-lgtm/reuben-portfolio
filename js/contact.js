const form = document.getElementById('contactForm');
const statusEl = document.getElementById('cfStatus');
const submitBtn = document.getElementById('cfSubmit');

function setError(input, message) {
    const err = input.closest('div').querySelector('.cf-error');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (err) err.textContent = message;
}

function validate() {
    let ok = true;
    const first = form.first_name, last = form.last_name, email = form.email, phone = form.phone;

    [[first, 'Please enter your first name.'], [last, 'Please enter your last name.']].forEach(([el, msg]) => {
        const bad = !el.value.trim();
        setError(el, bad ? msg : '');
        if (bad) ok = false;
    });

    const emailBad = !email.value.trim() || !email.checkValidity();
    setError(email, emailBad ? 'Please enter a valid email address.' : '');
    if (emailBad) ok = false;

    // Phone is optional, but if filled it must look like a phone number
    const phoneBad = phone.value.trim() && !/^[+()\d\s-]{7,20}$/.test(phone.value.trim());
    setError(phone, phoneBad ? 'Please enter a valid phone number.' : '');
    if (phoneBad) ok = false;

    return ok;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.className = 'cf-status';
    statusEl.textContent = '';

    if (!validate()) {
        const firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
    }

    // Join the ticked services into one line for the email
    const data = new FormData(form);
    const services = data.getAll('services').join(', ');
    data.delete('services');
    data.set('services', services || 'None selected');

    submitBtn.disabled = true;

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' }
        });

        if (res.ok) {
            form.reset();
            statusEl.textContent = "Thanks! Your message is on its way. I'll be in touch soon.";
            statusEl.classList.add('is-success');
        } else {
            throw new Error('Request failed');
        }
    } catch (err) {
        statusEl.textContent = 'Something went wrong. Please try again, or email hello@reubenlotsima.com.';
        statusEl.classList.add('is-error');
    } finally {
        submitBtn.disabled = false;
    }
});