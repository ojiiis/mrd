const oLoader = () => {
    const head = document.head;
    const body = document.body;
    let oldBodyText = body.innerHTML.replace(/<script[\s\S]*?<\/script>/gi, "");
    let oldHeadText = head.innerHTML;
    const queue = [];
    const contentWork = [];
    let userLoadingElement = null;

    const isLink = (str) => /^(https?:\/\/|\/|\.\.?\/)/.test(str);

    const scriptExists = (src) => {
        return [...document.scripts].some(script => script.src === src);
    };

    const loadContent = async (file, target, type = "", option = "e", element = null) => {
        try {
            let content = file;

            if (isLink(file)) {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                content = await response.text();
            }

            const scriptMatches = [...content.matchAll(/<script[\s\S]*?<\/script>/gi)];
            const cleanContent = content.replace(/<script[\s\S]*?<\/script>/gi, "");

            if (element) {
                option === "e"
                    ? element.insertAdjacentHTML("beforeend", cleanContent)
                    : element.insertAdjacentHTML("afterstart", cleanContent);
            } else if (type !== "script") {
                if (target === "body") {
                    oldBodyText = option == "e" ? oldBodyText + cleanContent : cleanContent + oldBodyText;
                } else {
                    oldHeadText = option == "e" ? oldHeadText+ cleanContent : cleanContent + oldHeadText;
                }
            }

            for (const scriptMatch of scriptMatches) {
                const scriptContent = scriptMatch[0];
                const newScript = document.createElement("script");
                const srcMatch = scriptContent.match(/src=["']([^"']+)["']/);

                if (srcMatch) {
                    const src = srcMatch[1];
                    if (!scriptExists(src)) {
                        newScript.src = src;
                        newScript.async = false;
                        body.appendChild(newScript);
                    }
                } else {
                    newScript.type = "module";
                    newScript.textContent = scriptContent.replace(/<script.*?>|<\/script>/gi, "");
                    body.appendChild(newScript);
                }
            }
        } catch (e) {
            console.error(`Error loading file: ${file}`, e);
        }
    };

    const loadScript = async (file, target, type = "", option = "e", element = null) => {
        try {
            let content = file;

            if (isLink(file)) {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                content = await response.text();
            }

            const scriptMatches = [...content.matchAll(/<script[\s\S]*?<\/script>/gi)];
            const cleanContent = content.replace(/<script[\s\S]*?<\/script>/gi, "");

            if (element) {
                option === "e"
                    ? element.insertAdjacentHTML("beforeend", cleanContent)
                    : element.insertAdjacentHTML("afterstart", cleanContent);
            } else if (type !== "script") {
                if (target === "body") {
                    oldBodyText = option == "e" ? oldBodyText + cleanContent : cleanContent + oldBodyText;
                } else {
                    oldHeadText = option == "e" ? oldHeadText+ cleanContent : cleanContent + oldHeadText;
                }
            }

            for (const scriptMatch of scriptMatches) {
                const scriptContent = scriptMatch[0];
                const newScript = document.createElement("script");
                const srcMatch = scriptContent.match(/src=["']([^"']+)["']/);

                if (srcMatch) {
                    const src = srcMatch[1];
                    if (!scriptExists(src)) {
                        newScript.src = src;
                        newScript.async = false;
                        body.appendChild(newScript);
                    }
                } else {
                    newScript.type = "module";
                    newScript.textContent = scriptContent.replace(/<script.*?>|<\/script>/gi, "");
                    body.appendChild(newScript);
                }
            }
        } catch (e) {
            console.error(`Error loading file: ${file}`, e);
        }
    };

    const instance = {
        beforeLoad(elem, callback) {
            if (typeof elem === "string") {
                if (isLink(elem)) {
                    fetch(elem)
                        .then(response => response.text())
                        .then(content => {
                            const container = document.createElement("div");
                            container.innerHTML = content;
                            userLoadingElement = container;
                            body.appendChild(userLoadingElement);
                        })
                        .catch(error => console.error(`Error loading beforeLoad file: ${elem}`, error));
                } else {
                    const container = document.createElement("div");
                    container.innerHTML = elem;
                    userLoadingElement = container;
                    body.appendChild(userLoadingElement);
                }
            } else if (elem instanceof Element) {
                userLoadingElement = elem;
                body.appendChild(userLoadingElement);
            }

            if (typeof callback === "function") callback();
        },
        head(file, option = "e") {
            contentWork.push(() => loadContent(file, "head", "", option));
            return instance;
        },
        body(file, option = "e") {
            contentWork.push(() => loadContent(file, "body", "", option));
            return instance;
        },
        script(file) {
            queue.push(() => loadScript(file, "body", "script", ""));
            return instance;
        },
        load(callback = null) {
            (async () => {
                for (const task of contentWork) await task();
                    // body.innerHTML = "";
                    body.innerHTML = oldBodyText;
                    // head.innerHTML = "";
                    head.innerHTML = oldHeadText;
                for (const task of queue) await task();
                if (userLoadingElement?.parentNode) userLoadingElement.remove();

                // Assign body() to all elements (independent of instance)
                Element.prototype.body = async function (file, option = "e") {
                    await loadContent(file, this.tagName.toLowerCase() === "head" ? "head" : "body", "", option);
                };

                if (typeof callback === "function") callback();
            })();
        }
    };

    // Updated put() method to remove scripts before inserting content and re-add them afterward
    Element.prototype.put = async function (file, option = "e") {
        // Remove all scripts in the body and store them
        const scripts = [...document.body.querySelectorAll("script")].map(script => {
            return {
                src: script.src,
                content: script.innerHTML
            };
        });
        document.body.querySelectorAll("script").forEach(script => script.remove());

        // Load and insert new content
        await loadContent(file, null, "", option, this);

        // Re-add the scripts
        for (const { src, content } of scripts) {
            const newScript = document.createElement("script");
            if (src) {
                newScript.src = src;
                newScript.async = false;
            } else {
                newScript.textContent = content;
            }
            document.body.appendChild(newScript);
        }
    };

    return instance;
};
