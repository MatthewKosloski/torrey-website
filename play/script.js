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
    supportedFlags.forEach(({name, description}) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = description;

        if (defaultFlags.includes(name))
            option.selected = true;

        flagSelectContainer.appendChild(option);
    });

    flagSelectContainer.disabled = false;

    const btnRun = document.querySelector('#js-run');


    btnRun.addEventListener('click', () => {
        const flag = document.querySelector('#js-flag-select').value;
        const semanticVersion = document.querySelector('#js-version-select').value;

        let flags = [];
        if (flag) flags.push(flag);

        const body = JSON.stringify({
            program: document.querySelector('#js-textarea-input').value.trim(),
            options: { flags, semanticVersion }
        });

        fetch('https://yo6quyed5e.execute-api.us-east-1.amazonaws.com/test/compile', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body
        }).then(res => res.json())
        .then((json) => {
            const console = document.querySelector('#js-console');
            if (json.stdout) {
                const span = document.createElement('span');
                span.setAttribute('class', 'torrey-console__stdout');
                span.textContent = json.stdout.trim();
                console.appendChild(span);
                const cursor = document.createElement('span');
                cursor.innerHTML = '&gt;';
                console.appendChild(cursor);
            }
            if (json.stderr) {
                const span = document.createElement('span');
                span.setAttribute('class', 'torrey-console__stderr');
                span.textContent = json.stderr.trim();
                console.appendChild(span);
                const cursor = document.createElement('span');
                cursor.innerHTML = '&gt;';
                console.appendChild(cursor);
            }
        });
    });

})();