export function styler() {
    document.getElementById("set2").addEventListener("click", function() {
        document.getElementById("set1").style.backgroundColor = "#dedede";
        document.getElementById("set2").style.backgroundColor = "#eeeeee";
        document.getElementById("signin").style.backgroundColor = "#234E38";
    });
    document.getElementById("set1").addEventListener("click", function() {
        document.getElementById("set2").style.backgroundColor = "#dedede";
        document.getElementById("set1").style.backgroundColor = "#eeeeee";
        document.getElementById("signin").style.backgroundColor = "#201e43";
    });
}