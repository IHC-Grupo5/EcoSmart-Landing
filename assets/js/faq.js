(function () {
    "use strict";

    function init() {
        var faqItems = document.querySelectorAll('.faq__item');
        if (faqItems.length) {
            faqItems.forEach(function (item) {
                var btn = item.querySelector('.faq__question');
                var answer = item.querySelector('.faq__answer');

                if (!btn || !answer) return;

                btn.addEventListener('click', function () {
                    var isOpen = item.classList.contains('is-open');

                    faqItems.forEach(function (i) {
                        i.classList.remove('is-open');

                        var a = i.querySelector('.faq__answer');
                        if (a) a.style.maxHeight = '0';
                    });

                    if (!isOpen) {
                        item.classList.add('is-open');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            });
        }

        var faqSearchInput = document.getElementById('faqSearchInput');
        var faqNoResults = document.getElementById('faqNoResults');
        var faqGrid = document.querySelector('.seccion-faq .faq__grid');

        if (faqSearchInput && faqItems.length) {
            faqSearchInput.addEventListener('input', function () {
                var query = faqSearchInput.value
                    .trim()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase();

                var visibleCount = 0;

                faqItems.forEach(function (item) {
                    var btn = item.querySelector('.faq__question');
                    var answer = item.querySelector('.faq__answer');

                    if (!btn || !answer) return;

                    var questionText = btn.textContent
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase();
                    var answerText = answer.textContent
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase();

                    if (questionText.indexOf(query) !== -1 || answerText.indexOf(query) !== -1) {
                        item.style.display = '';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('is-open');
                        answer.style.maxHeight = '0';
                    }
                });

                var columns = document.querySelectorAll('.faq__col');
                columns.forEach(function (col) {
                    var children = Array.from(col.children);
                    var currentTitle = null;
                    var itemsInGroup = [];

                    children.forEach(function (child) {
                        if (child.classList.contains('faq__col-title')) {
                            if (currentTitle) {
                                var hasVisible = itemsInGroup.some(function (item) {
                                    return item.style.display !== 'none';
                                });
                                currentTitle.style.display = hasVisible ? '' : 'none';
                            }
                            currentTitle = child;
                            itemsInGroup = [];
                        } else if (child.classList.contains('faq__item')) {
                            itemsInGroup.push(child);
                        }
                    });

                    if (currentTitle) {
                        var hasVisible = itemsInGroup.some(function (item) {
                            return item.style.display !== 'none';
                        });
                        currentTitle.style.display = hasVisible ? '' : 'none';
                    }
                });

                // Handle "No Results" message visibility
                if (visibleCount > 0) {
                    if (faqGrid) faqGrid.style.display = '';
                    if (faqNoResults) faqNoResults.style.display = 'none';
                } else {
                    if (faqGrid) faqGrid.style.display = 'none';
                    if (faqNoResults) faqNoResults.style.display = 'block';
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
