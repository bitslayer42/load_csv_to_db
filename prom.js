const isMomHappy = true;
const willIGetNewPhone = (isShe)=>{
    if (isShe) {
        const phone = {
            brand: 'Samsung',
            color: 'black'
        };
        return Promise.resolve(phone);
    } else {
        const reason = new Error('mom is not happy');
        return Promise.reject(reason);
    }
};

const showOff = (data)=>{
    const message = 'Hey friend, I have ' + data[1] + ' new ' +
    data[0].color + ' ' + data[0].brand + ' phones';
    return Promise.resolve(message);
};

const runPreSql = ()=>{

        console.log('This is the prestep ');
        return Promise.resolve();

    //return Promise.reject(new Error('boo'));
};

const countPhones = new Promise((resolve, reject) => {
    setTimeout(resolve, 3000, 17);
    //return Promise.resolve(17);
    //return Promise.reject(new Error('wut'));
});

// chaining promises:
// First runPreSql completes, then both willIGetNewPhone and
// countPhones run. When both are complete, showoff runs.
runPreSql().then(() => {
        return Promise.all([ willIGetNewPhone(isMomHappy), countPhones ])
    })
    .then(showOff)
    .then(fulfilled => console.log(fulfilled))
    .catch(error => console.log(error.message))

