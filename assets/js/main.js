window.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name-input')
    const nameConfig = document.getElementById('name')

    const hostInput = document.getElementById('host-input')
    const hostConfig = document.getElementById('host')

    const protocolInput = document.getElementById('protocol-input')
    const protocolConfig = document.getElementById('protocol')

    const portInput = document.getElementById('port-input')
    const portConfig = document.getElementById('port')

    const remotePathInput = document.getElementById('remote-path-input')
    const remotePathConfig = document.getElementById('remote-path')

    const usernameInput = document.getElementById('username-input')
    const usernameConfig = document.getElementById('username')

    const passwordInput = document.getElementById('password-input')
    const passwordConfig = document.getElementById('password')

    const uploadOnSaveInput = document.getElementById('upload-on-save-input')
    const uploadOnSaveConfig = document.getElementById('upload-on-save')

    updateElementValue(nameConfig, nameInput.value)
    updateElementValue(hostConfig, hostInput.value)
    updateElementValue(protocolConfig, protocolInput.value)
    updateElementValue(portConfig, portInput.value)
    updateElementValue(remotePathConfig, remotePathInput.value)
    updateElementValue(usernameConfig, usernameInput.value)
    updateElementValue(passwordConfig, passwordInput.value)
    updateElementValue(uploadOnSaveConfig, uploadOnSaveInput.value)

    registerListener('keyup', nameInput, nameConfig)
    registerListener('keyup', hostInput, hostConfig)
    registerListener('change', protocolInput, protocolConfig)
    registerListener('change', portInput, portConfig)
    registerListener('keyup', remotePathInput, remotePathConfig)
    registerListener('keyup', usernameInput, usernameConfig)
    registerListener('keyup', passwordInput, passwordConfig)
    registerListener('change', uploadOnSaveInput, uploadOnSaveConfig)

    //-----------------------------------------------------------------------------
    const copyButton = document.getElementById('copy-btn')
    const downloadButton = document.getElementById('download-btn')

    copyButton.addEventListener('click', () => {
        const content = generateContent()

        copyTextToClipboard(content)
    })

    downloadButton.addEventListener('click', () => {
        const content = generateContent()

        download('sftp.json', content)
    })
})

function registerListener(typeOfListener, inputElement, configElement) {
    inputElement.addEventListener(typeOfListener, () => {
        let value = inputElement.value

        if (inputElement.type === 'checkbox') {
            value = inputElement.checked
        }

        configElement.innerText = value
    })
}

function updateElementValue(element, value) {
    element.innerText = value
}

function generateContent() {
    const keys = document.querySelectorAll('.key')
    const values = document.querySelectorAll('.value')

    let fileContent = '{'

    for (let i = 0; i < keys.length; i++) {
        fileContent += `"${keys[i].innerText}": "${values[i].innerText}"`

        // Add commas to all fields except the last one
        if (i !== keys.length - 1) { 
            fileContent += ','
        }
    }

    fileContent += '}'

    return fileContent
}

function download(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text)
        return
    }

    navigator.clipboard.writeText(text)
        .then(function() {
            notifySuccessfullCopy()
        }, function(err) {
            console.error('Async: Could not copy text: ', err)
        }
    );
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea")
    textArea.value = text
    
    // Avoid scrolling to bottom
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
        const successful = document.execCommand('copy')

        if (successful) {
            notifySuccessfullCopy()
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
    }

    document.body.removeChild(textArea)
}

function notifySuccessfullCopy() {
    const copyButton = document.getElementById('copy-btn')

    copyButton.innerText = 'Copied!'

    setTimeout(() => {
        copyButton.innerText = 'Copy'
    }, 3000)
}