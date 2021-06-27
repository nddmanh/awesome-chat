function increaseNumberNotiContact(className) { 
    let currentValue = +$(`.${className}`).find("b").text();
    currentValue++;
    
    if (currentValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<b>${currentValue}</b>)`);
    }
}

function decreaseNumberNotiContact(className) { 
    let currentValue = +$(`.${className}`).find("b").text();
    currentValue--;
    
    if (currentValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<b>${currentValue}</b>)`);
    }
}
