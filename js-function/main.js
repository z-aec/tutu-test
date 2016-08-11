"use strict";
console.clear();

(w => {
    // Yor code here ...

    function dscount(str, ch1, ch2){
        var s = 0;
        str = str.toLowerCase();
        ch1 = ch1.toLowerCase();
        ch2 = ch2.toLowerCase();
        for(var i = 0; i < str.length - 1; i++){
            if(str.charAt(i) == ch1 && str.charAt(i + 1) == ch2)
                s++;
        }
        return s;
    }


    // Для удобства можно использовать эти тесты:
    try {
        test(dscount, ['Ab___aB__', 'a', 'B'], 2);
        test(dscount, ['___cd____', 'c', 'd'], 1);
        test(dscount, ['de_______', 'd', 'e'], 1);
        test(dscount, ['12_12__12', '1', '2'], 3);
        test(dscount, ['_ba______', 'a', 'b'], 0);
        test(dscount, ['_a__b____', 'a', 'b'], 0);
        test(dscount, ['-ab-аb-ab', 'a', 'b'], 2);
        test(dscount, ['aaa', 'a', 'a'], 2);

        console.info("Congratulations! All tests success passed.");
    } catch(e) {
        console.error(e);
    }

    // Простая функция тестирования
    function test(call, args, count, n) {
        let r = (call.apply(n, args) === count);
        console.assert(r, `Finded items count: ${count}`);
        if (!r) throw "Test failed!";
    }

    if(typeof dscount.toString === "function")
        document.write('<pre>    ' + dscount.toString() + '</pre>');
    else
        document.write('Смотрите код main.js');

    return '--- End ---';
})(window);