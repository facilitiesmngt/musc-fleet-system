document.addEventListener('DOMContentLoaded', function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

  const form = document.getElementById('mileageForm');
  const saveBtn = document.getElementById('saveMileageBtn');
  const statusBox = document.getElementById('mileageStatus');
  const signatureInput = document.getElementById('signatureImage');
  const signaturePreview = document.getElementById('signaturePreview');

  if (signatureInput && signaturePreview) {
    signatureInput.addEventListener('change', function () {
      const file = this.files && this.files[0];
      if (!file) {
        signaturePreview.textContent = 'Awaiting signature image upload';
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        signaturePreview.innerHTML = '<img src="' + event.target.result + '" alt="Driver signature" style="max-width:220px; max-height:100px; object-fit:contain; border-radius:8px; border:1px solid #dfe7f0; background:#fff;" />';
      };
      reader.readAsDataURL(file);
    });
  }

  if (saveBtn && form) {
    saveBtn.addEventListener('click', function () {
      const data = new FormData(form);
      const tripDate = data.get('tripDate');
      const driver = data.get('driverName');
      const vehicle = data.get('vehicleUnit');

      if (!tripDate || !driver || !vehicle) {
        if (statusBox) {
          statusBox.textContent = 'Please complete all required mileage fields before saving.';
          statusBox.className = 'alert err show';
        }
        return;
      }

      const records = JSON.parse(localStorage.getItem('fm-phoenix-mileage-records') || '[]');
      const signature = signatureInput && signatureInput.files && signatureInput.files[0]
        ? (() => {
            const reader = new FileReader();
            const result = new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result);
              reader.onerror = () => reject(new Error('Unable to read signature image.'));
              reader.readAsDataURL(signatureInput.files[0]);
            });
            return result;
          })()
        : Promise.resolve('');

      Promise.resolve(signature).then((signatureData) => {
        records.push({
          tripDate,
          driverName: driver,
          vehicleUnit: vehicle,
          jobFunction: data.get('jobFunction'),
          startOdometer: data.get('startOdometer'),
          endOdometer: data.get('endOdometer'),
          tripFrom: data.get('tripFrom'),
          tripTo: data.get('tripTo'),
          passengers: data.get('passengers'),
          fuelLevel: data.get('fuelLevel'),
          tripStatus: data.get('tripStatus'),
          purposeOfTrip: data.get('purposeOfTrip'),
          signatureImage: signatureData,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('fm-phoenix-mileage-records', JSON.stringify(records));

        if (statusBox) {
          statusBox.textContent = 'Mileage log saved successfully. It is ready for review and PDF generation.';
          statusBox.className = 'alert ok show';
        }

        form.reset();
        if (signaturePreview) signaturePreview.textContent = 'Awaiting signature image upload';
      }).catch(() => {
        if (statusBox) {
          statusBox.textContent = 'There was a problem saving the signature image. Please try again.';
          statusBox.className = 'alert err show';
        }
      });
    });
  }
});
