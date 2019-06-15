$(function () {

    /*
     * Slideshow
     */
    $('.slideshow').each(function () {

        // 変数の準備
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        var $container = $(this),                                 // a
            $slideGroup = $container.find('.slideshow-slides'),         // b
            $slides = $slideGroup.find('.slide'),                 // c
            $nav = $container.find('.slideshow-nav'),             // d
            $indicator = $container.find('.slideshow-indicator'), // e
            // スライドショー内の各要素の jQuery オブジェクト
            // a スライドショー全体のコンテナー
            // b 全スライドのまとまり (スライドグループ)
            // c 各スライド
            // d ナビゲーション (Prev/Next)
            // e インジケーター (ドット)

            slideCount = $slides.length, // スライドの点数
            indicatorHTML = '',          // インジケーターのコンテンツ
            currentIndex = 0,            // 現在のスライドのインデックス
            duration = 500,              // 次のスライドへのアニメーションの所要時間
            easing = 'easeInOut',    // 次のスライドへのアニメーションのイージングの種類
            interval = 3500,             // 自動で次のスライドに移るまでの時間
            timer;                       // タイマーの入れ物


        // HTML 要素の配置、生成、挿入
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


        $slides.each(function (i) {
            $(this).css({ left: 100 * i + '%' });
            indicatorHTML += '<a href="#">' + (i + 1) + '</a>';
        });

        $indicator.html(indicatorHTML);

        // 各スライドの位置を決定し、
        // 対応するインジケーターのアンカーを生成
        // $slides.each(function (i) {
        //     $(this).css({ left: 100 * i + '%' });
        //     indicatorHTML += '<a href="#">' + (i + 1) + '</a>';
        // });

        // インジケーターにコンテンツを挿入
        // $indicator.html(indicatorHTML);

        // 関数の定義
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // 任意のスライドを表示する関数
        function goToSlide(index) {
            // スライドグループをターゲットの位置に合わせて移動
            $slideGroup.animate({ left: - 100 * index + '%' }, duration);
            console.log($slideGroup)
            // 現在のスライドのインデックスを上書き
            //animate属性。animate( 属性 [,期間] [,イージング] [,function] )
            //属性はcssで、数値で変更できるものに限る。backgroundは不可。
            //期間は、目的の値までの期間をミリ秒で指定
            //イージングはアニメの加速度のタイプを指定
            //functionはアニメの完了後に実行するコールバック
            currentIndex = index;
            // ナビゲーションとインジケーターの状態を更新
            updateNav();
        }



        // スライドの状態に応じてナビゲーションとインジケーターを更新する関数
        function updateNav() {
            var $navPrev = $nav.find('.prev'), // Prev (戻る) リンク
                $navNext = $nav.find('.next'); // Next (進む) リンク
            // もし最初のスライドなら Prev ナビゲーションを無効に
            if (currentIndex === 0) {
                $navPrev.addClass('disabled');
            } else {
                $navPrev.removeClass('disabled');
            }
            // もし最後のスライドなら Next ナビゲーションを無効に
            if (currentIndex === slideCount - 1) {
                $navNext.addClass('disabled');
            } else {
                $navNext.removeClass('disabled');
            }
            // 現在のスライドのインジケーターを無効に
            $indicator.find('a').removeClass('active')
                .eq(currentIndex).addClass('active');
        }

        // タイマーを開始する関数
        function startTimer() {
            // 変数 interval で設定した時間が経過するごとに処理を実行
            timer = setInterval(function () {
                // 現在のスライドのインデックスに応じて次に表示するスライドの決定
                // もし最後のスライドなら最初のスライドへ
                var nextIndex = (currentIndex + 1) % slideCount;
                goToSlide(nextIndex);
            }, interval);
        }

        // // タイマーを停止る関数
        function stopTimer() {
            clearInterval(timer);
        }


        // インベントの登録
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // ナビゲーションのリンクがクリックされたら該当するスライドを表示
        $nav.on('click', 'a', function (event) {
            //調査範囲.on( イベント名, セレクタ, function)ver1.7〜
            event.preventDefault();
            if ($(this).hasClass('prev')) {
                //$(this)はjQueryオブジェクト。
                //thisの持つ情報はjavascriptで操作できる「DOM要素」です。イベントで設定したfunction内で利用したイベントが発生したDOM要素を指します。
                //$(this)は、メソッドで操作したい時に使用。
                //逆にthisのみの場合はそのままそのプロパティ（idの取得、target属性取得の場合に使用）
                //$('a').each(function() {
                //var l = this.href();
                //})
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex + 1);
            }
        });

        // インジケーターのリンクがクリックされたら該当するスライドを表示
        $indicator.on('click', 'a', function (event) {
            console.log("asdfa")
            //eventオブジェクトはイベント発生時に実行するfunctionに渡されるobjectオブジェクトで、様々なプロパティやメソッドを持っています。
            event.preventDefault();
            if (!$(this).hasClass('active')) {
                goToSlide($(this).index());
                //引数に設定した要素とマッチした要素のインデックス番号を取得。引数に何も設定していない場合はオブジェクトで指定した要素を「兄弟要素の中で」何番目になるか取得します。
            }
        });

        // マウスが乗ったらタイマーを停止、はずれたら開始
        $container.on({
            mouseenter: stopTimer,
            mouseleave: startTimer
        });


        // スライドショーの開始
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // 最初のスライドを表示
        goToSlide(currentIndex);

        // タイマーをスタート
        startTimer();

    });
});




$(function () {
    var topBtn = $('#page-top');
    topBtn.hide();
    //スクロールが500に達したらボタン表示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            topBtn.fadeIn();
        } else {
            topBtn.fadeOut();
        }
    });
    //スルスルっとスクロールでトップへもどる
    // topBtn.click(function () {
    //     $('body,html').animate({
    //         scrollTop: 0
    //     }, 400);
    //     return false;
    // });
});



const targets = document.querySelectorAll("[data-observer]");
const images = document.querySelectorAll("[data-img]");

const options = {
    rootMargin: "0px",
    threshold: 1.0
};

const addClass = el => {
    if (!el.classList.contains("is-visible")) {
        el.classList.add("is-visible");
    }
};

const removeClass = el => {
    if (el.classList.contains("is-visible")) {
        el.classList.remove("is-visible");
    }
};

const doThings = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            addClass(entry.target);
        } else {
            removeClass(entry.target);
        }
    });
};

const observer = new IntersectionObserver(doThings, options);

const observer2 = new IntersectionObserver(doThings, {
    ...options,
    threshold: 0.4
});

targets.forEach(target => {
    observer.observe(target);
});

images.forEach(target => {
    observer2.observe(target);
});


