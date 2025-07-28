
document.addEventListener('DOMContentLoaded', () => {
    const sepalLengthInput = document.getElementById('sepalLength');
    const sepalWidthInput = document.getElementById('sepalWidth');
    const petalLengthInput = document.getElementById('petalLength');
    const petalWidthInput = document.getElementById('petalWidth');

    const sepalLengthValue = document.getElementById('sepalLengthValue');
    const sepalWidthValue = document.getElementById('sepalWidthValue');
    const petalLengthValue = document.getElementById('petalLengthValue');
    const petalWidthValue = document.getElementById('petalWidthValue');

    const predictBtn = document.getElementById('predictBtn');
    const predictionOutput = document.getElementById('predictionOutput');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const probabilitiesOutput = document.getElementById('probabilitiesOutput'); 

    // Updating range value displays
    sepalLengthInput.addEventListener('input', () => {
        sepalLengthValue.textContent = sepalLengthInput.value;
    });
    sepalWidthInput.addEventListener('input', () => {
        sepalWidthValue.textContent = sepalWidthInput.value;
    });
    petalLengthInput.addEventListener('input', () => {
        petalLengthValue.textContent = petalLengthInput.value;
    });
    petalWidthInput.addEventListener('input', () => {
        petalWidthValue.textContent = petalWidthInput.value;
    });

    predictBtn.addEventListener('click', async () => {
        const sepalLength = parseFloat(sepalLengthInput.value);
        const sepalWidth = parseFloat(sepalWidthInput.value);
        const petalLength = parseFloat(petalLengthInput.value);
        const petalWidth = parseFloat(petalWidthInput.value);

        const features = [sepalLength, sepalWidth, petalLength, petalWidth];

        predictionOutput.classList.add('hidden');
        probabilitiesOutput.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        predictionOutput.textContent = '';
        probabilitiesOutput.innerHTML = '';

        try {
            const response = await fetch('http://localhost:3000/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ features: features }),
            });

            const data = await response.json();

            loadingIndicator.classList.add('hidden');
            predictionOutput.classList.remove('hidden');

            if (response.ok) {
                predictionOutput.textContent = `Predicted Species: ${data.prediction}`;
                predictionOutput.style.color = '#2196F3';

                if (data.probabilities) {
                    probabilitiesOutput.classList.remove('hidden');
                    let probHtml = '<h3>Probabilities from the model:</h3><ul>';

                    // Convert probabilities object to an array of [label, prob] pairs
                    const probEntries = Object.entries(data.probabilities);

                    // Sort them in descending order to easily find the max
                    probEntries.sort((a, b) => b[1] - a[1]);

                    const highestProb = probEntries[0][1]; // Get the value of the highest probability

                    // Iterate through sorted probabilities to assign colors
                    for (const [label, prob] of probEntries) {
                        let colorClass = '';
                        // Assigning color classes based on probability thresholds
                        if (prob === highestProb) {
                            colorClass = 'prob-high';
                        } else if (prob >= 0.5) { // Example threshold for medium-high
                            colorClass = 'prob-medium-high';
                        } else if (prob >= 0.2) { // Example threshold for medium-low
                            colorClass = 'prob-medium-low';
                        } else { // Below 0.2 or lowest overall
                            colorClass = 'prob-low';
                        }

                        probHtml += `<li class="${colorClass}">${label}: ${(prob * 100).toFixed(2)}%</li>`;
                    }
                    probHtml += '</ul>';
                    probabilitiesOutput.innerHTML = probHtml;
                }

            } else {
                predictionOutput.textContent = `Error: ${data.error || 'Prediction failed.'}`;
                predictionOutput.style.color = '#f44336';
                probabilitiesOutput.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error during prediction:', error);
            loadingIndicator.classList.add('hidden');
            predictionOutput.classList.remove('hidden');
            predictionOutput.textContent = 'Failed to connect to prediction service. Ensure Node.js server and Flask app are running.';
            predictionOutput.style.color = '#f44336';
            probabilitiesOutput.classList.add('hidden');
        }
    });
});