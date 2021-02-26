function deleteRow(idButton) {
    //    console.log('idButton ' + idButton);
    return new Promise(function (resolve, reject) {
        document.getElementById('deleteButton' + idButton).addEventListener('click', function (event) {
            var req = new XMLHttpRequest();
            
            reqURL = nodeURL + 'delete' + '?rowId=' + idButton;
            console.log('reqURL:', reqURL);
            req.open('GET', reqURL, true);
            req.addEventListener("load", function () {
                if (req.status >= 200 && req.status < 400) {
                    if (req.responseText !== '') {
                        console.log(JSON.parse(req.responseText));
                        let response = JSON.parse(req.responseText);
                        console.log('response: ' + response.results);
                        showTable();
                    } else {
                        console.log('error');
                    }
                } else {
                    console.log("Error! " + req.statusText);
                }
            });
            req.send(null);
            showTable();
        });
    });



    }
    ;