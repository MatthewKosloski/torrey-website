(async function(){
    let supportedSemanticVersions;
    let supportedFlags;
    let defaultSemanticVersion;
    let defaultFlags;

    // Fetch supported semantic versions and supported flags
    // from the lambda configuration file.
    const response = await fetch('https://raw.githubusercontent.com/MatthewKosloski/torrey-playground/master/lambda/config.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    
    supportedSemanticVersions = json[0].supportedSemanticVersions;
    supportedFlags = json[0].supportedFlags;
    defaultSemanticVersion = json[0].defaults.options.semanticVersion;
    defaultFlags = json[0].defaults.options.flags;

    // Populate controls with elements derived from the configuration file.
    const versionSelectContainer = document.querySelector('#js-version-select');
    const flagSelectContainer = document.querySelector('#js-flag-select');

    // Populate version select dropdown with options.
    supportedSemanticVersions.forEach((version) => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = `v${version}`;

        if (version === defaultSemanticVersion)
            option.selected = true;

        versionSelectContainer.appendChild(option);
    });

    versionSelectContainer.disabled = false;

    // Populate control with compiler flag radio buttons.
    supportedFlags.forEach((flag) => {
        const formCheck = document.createElement('div');
        formCheck.setAttribute('class', 'form-check form-check-inline');
        const formCheckInput = document.createElement('input');
        formCheckInput.setAttribute('id', `torrey-flag${flag}`);
        formCheckInput.setAttribute('class', 'form-check-input');
        formCheckInput.setAttribute('type', 'radio');
        formCheckInput.setAttribute('name', 'torrey-flag');
        formCheckInput.setAttribute('value', flag);

        if (defaultFlags.includes(flag))
            formCheckInput.checked = true;
        
        const formCheckLabel = document.createElement('label');
        formCheckLabel.setAttribute('class', 'form-check-label');
        formCheckLabel.setAttribute('for', `torrey-flag${flag}`);
        formCheckLabel.textContent = flag;
        formCheck.appendChild(formCheckInput);
        formCheck.appendChild(formCheckLabel);
        flagSelectContainer.appendChild(formCheck);
    });

    const btnRun = document.querySelector('#js-run');


    btnRun.addEventListener('click', () => {

        let flags;
        supportedFlags.forEach((flag) => {
            if (document.querySelector(`#torrey-flag${flag}`).checked)
              flags = [flag];
        });

        const semanticVersion = document.querySelector('#js-version-select').value;

        const body = JSON.stringify({
            program: document.querySelector('#js-textarea-input').value.trim(),
            options: {
                flags,
                semanticVersion 
            }
        });

        // console.log('sending this to lambda', body);

        fetch('https://yo6quyed5e.execute-api.us-east-1.amazonaws.com/test/compile', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body
        }).then(res => res.json())
        .then((json) => console.log('lambda response', json));


    });

})();