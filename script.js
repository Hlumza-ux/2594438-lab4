async function searchCountry(countryName) {
    const countryInfo = document.getElementById('country-info');
    const borderGrid = document.getElementById('bordering-countries');
    const spinner = document.getElementById('loading-spinner');
    const errorDiv = document.getElementById('error-message');

    errorDiv.textContent = '';
    countryInfo.innerHTML = '';
    borderGrid.innerHTML = '';
    spinner.classList.remove('hidden');

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        
        if (!response.ok) throw new Error('Country not found. Please try again.');

        const [country] = await response.json();

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="200">
        `;

        if (country.borders && country.borders.length > 0) {
            const codes = country.borders.join(',');
            // FIXED: Added 'codes=' to the URL
            const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}`);
            
            if (!borderResponse.ok) throw new Error('Failed to fetch bordering countries.');
            
            const neighbors = await borderResponse.json();

            borderGrid.innerHTML = '<h3>Bordering Countries:</h3>';
            neighbors.forEach(neighbor => {
                const neighborDiv = document.createElement('div');
                neighborDiv.innerHTML = `
                    <p>${neighbor.name.common}</p>
                    <img src="${neighbor.flags.svg}" alt="${neighbor.name.common} flag" width="50">
                `;
                borderGrid.appendChild(neighborDiv);
            });
        } else {
            borderGrid.innerHTML = '<p>No bordering countries.</p>';
        }

    } catch (error) {
        errorDiv.textContent = error.message;
    } finally {
        spinner.classList.add('hidden');
    }
}

const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');

searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (country) searchCountry(country);
});

countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = countryInput.value.trim();
        if (country) searchCountry(country);
    }
});
