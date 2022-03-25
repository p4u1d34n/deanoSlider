const preventClick = (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  if (navigator.msMaxTouchPoints) {
    $("#slider").addClass("ms-touch");
    $("#slider").on("scroll", function () {
      $(".slide-image").css(
        "transform",
        "translate3d(-" + (100 - $(this).scrollLeft() / 6) + "px,0,0)"
      );
    });
  } else {
    var ds = {
      el: {
        slider: $("#slider"),
        holder: $(".holder"),
        imgSlide: $(".slide-image")
      },
      slideWidth: $("#slider").width(),
      touchstartx: undefined,
      touchmovex: undefined,
      movex: undefined,
      auto: true,
      index: 0,
      interval: 3000,
      longTouch: undefined,
      init: function () {
        this.setToIndex();
        this.bindUIEvents();
        this.bindMouseEvents();
        if (this.auto) {
          this.timer = setInterval(function () {
            if (ds.index < ds.el.imgSlide.length - 1) {
              ds.slideTo(ds.index+1);
            } else {
              ds.slideTo(0);
            }
          }, ds.interval);
        }
      },
      setToIndex: function () {
        var absMove = Math.abs(this.index * this.slideWidth - this.movex);
        // Calculate the index. All other calculations are based on the index.
        if (absMove > this.slideWidth / 2 || this.longTouch === false) {
          if (this.movex > this.index * this.slideWidth && this.index < 2) {
            this.index++;
          } else if (
            this.movex < this.index * this.slideWidth &&
            this.index > 0
          ) {
            this.index--;
          }
        }
        // Move and animate the elements.
        this.el.holder
          .addClass("animate")
          .css(
            "transform",
            "translate3d(-" + this.index * this.slideWidth + "px,0,0)"
          );
        this.el.imgSlide
          .addClass("animate")
          .css("transform", "translate3d(-" + 100 - this.index * 50 + "px,0,0)");
        this.tidyDots();
      },
      slideTo: function (i) {
        this.index = i;
        this.el.holder
          .addClass("animate")
          .css(
            "transform",
            "translate3d(-" + this.index * this.slideWidth + "px,0,0)"
          );
        this.el.imgSlide
          .addClass("animate")
          .css("transform", "translate3d(-" + 100 - this.index * 50 + "px,0,0)");
        this.tidyDots();
      },
      tidyDots: function () {
        $(".dots").removeClass("active");
        $(".dots:eq(" + this.index + ")").addClass("active");
      },
      bindMouseEvents: function () {
        let isDown = false;
        var isDragged = false;
        let startX;
        let scrollLeft;
  
        this.el.holder.on("mousedown", (event) => {
          event.preventDefault();
          // Get the original touch position.
          this.touchstartx = event.pageX;
  
          // The movement gets all janky if there's a transition on the elements.
          $(".animate").removeClass("animate");
        });
        this.el.holder.on("mouseup", (event) => {
          event.preventDefault();
          this.touchstartx = undefined;
          this.setToIndex();
        });
        this.el.holder.on("mouseleave", (event) => {
          event.preventDefault();
          this.touchstartx = undefined;
          this.setToIndex();
        });
        this.el.holder.on("mousemove", (event) => {
          event.preventDefault();
          this.touchmovex = event.pageX;
          this.movex =
            this.index * this.slideWidth + (this.touchstartx - this.touchmovex);
          var panx = 100 - this.movex / 6;
          if (this.movex < 600) {
            this.el.holder.css(
              "transform",
              "translate3d(-" + this.movex + "px,0,0)"
            );
          }
          if (panx < 100) {
            this.el.imgSlide.css("transform", "translate3d(-" + panx + "px,0,0)");
          }
          this.tidyDots();
        });
      },
      bindUIEvents: function () {
        this.el.holder.on("touchstart", function (event) {
          slider.start(event);
        });
        this.el.holder.on("touchmove", function (event) {
          slider.move(event);
        });
        this.el.holder.on("touchend", function (event) {
          slider.end(event);
        });
      },
      start: function (event) {
        this.longTouch = false;
        setTimeout(function () {
          window.slider.longTouch = true;
        }, 250);
        this.touchstartx = event.originalEvent.touches[0].pageX;
        $(".animate").removeClass("animate");
      },
      move: function (event) {
        this.touchmovex = event.originalEvent.touches[0].pageX;
        this.movex =
          this.index * this.slideWidth + (this.touchstartx - this.touchmovex);
        var panx = 100 - this.movex / 6;
        if (this.movex < 600) {
          this.el.holder.css(
            "transform",
            "translate3d(-" + this.movex + "px,0,0)"
          );
        }
        if (panx < 100) {
          this.el.imgSlide.css("transform", "translate3d(-" + panx + "px,0,0)");
        }
        this.tidyDots();
      },
      end: function (event) {
        this.setIndexTo();
      }
    };
  
    ds.init();
  }
  