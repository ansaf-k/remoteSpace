

export default () => {
    if (process.env.MODE === 'cordova' || process.env.MODE === 'capacitor') {
        const meta = document.createElement('meta')
        meta.setAttribute('name', 'viewport')
        meta.setAttribute('content', 'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, viewport-fit=cover')
        document.head.appendChild(meta)
    }
}