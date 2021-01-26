const result = document.getElementById("result")

document.getElementById("request").addEventListener("click", () => {
    let req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this)
            let json = JSON.parse(this.response)
            for (let i in json) {
                let obj = json[i]
                console.log(obj)
            }
        }
    }
    req.open("GET", "sample_json.json", true);
    req.send();
})