/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);
/*! jQuery v@1.8.0 jquery.com | jquery.org/license */

(function(a,b){function G(a){var b=F[a]={};return p.each(a.split(s),function(a,c){b[c]=!0}),b}function J(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(I,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:+d+""===d?+d:H.test(d)?p.parseJSON(d):d}catch(f){}p.data(a,c,d)}else d=b}return d}function K(a){var b;for(b in a){if(b==="data"&&p.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function ba(){return!1}function bb(){return!0}function bh(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function bi(a,b){do a=a[b];while(a&&a.nodeType!==1);return a}function bj(a,b,c){b=b||0;if(p.isFunction(b))return p.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return p.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=p.grep(a,function(a){return a.nodeType===1});if(be.test(b))return p.filter(b,d,!c);b=p.filter(b,d)}return p.grep(a,function(a,d){return p.inArray(a,b)>=0===c})}function bk(a){var b=bl.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function bC(a,b){return a.getElementsByTagName(b)[0]||a.appendChild(a.ownerDocument.createElement(b))}function bD(a,b){if(b.nodeType!==1||!p.hasData(a))return;var c,d,e,f=p._data(a),g=p._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;d<e;d++)p.event.add(b,c,h[c][d])}g.data&&(g.data=p.extend({},g.data))}function bE(a,b){var c;if(b.nodeType!==1)return;b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?(b.parentNode&&(b.outerHTML=a.outerHTML),p.support.html5Clone&&a.innerHTML&&!p.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):c==="input"&&bv.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text),b.removeAttribute(p.expando)}function bF(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bG(a){bv.test(a.type)&&(a.defaultChecked=a.checked)}function bX(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=bV.length;while(e--){b=bV[e]+c;if(b in a)return b}return d}function bY(a,b){return a=b||a,p.css(a,"display")==="none"||!p.contains(a.ownerDocument,a)}function bZ(a,b){var c,d,e=[],f=0,g=a.length;for(;f<g;f++){c=a[f];if(!c.style)continue;e[f]=p._data(c,"olddisplay"),b?(!e[f]&&c.style.display==="none"&&(c.style.display=""),c.style.display===""&&bY(c)&&(e[f]=p._data(c,"olddisplay",cb(c.nodeName)))):(d=bH(c,"display"),!e[f]&&d!=="none"&&p._data(c,"olddisplay",d))}for(f=0;f<g;f++){c=a[f];if(!c.style)continue;if(!b||c.style.display==="none"||c.style.display==="")c.style.display=b?e[f]||"":"none"}return a}function b$(a,b,c){var d=bO.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function b_(a,b,c,d){var e=c===(d?"border":"content")?4:b==="width"?1:0,f=0;for(;e<4;e+=2)c==="margin"&&(f+=p.css(a,c+bU[e],!0)),d?(c==="content"&&(f-=parseFloat(bH(a,"padding"+bU[e]))||0),c!=="margin"&&(f-=parseFloat(bH(a,"border"+bU[e]+"Width"))||0)):(f+=parseFloat(bH(a,"padding"+bU[e]))||0,c!=="padding"&&(f+=parseFloat(bH(a,"border"+bU[e]+"Width"))||0));return f}function ca(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=!0,f=p.support.boxSizing&&p.css(a,"boxSizing")==="border-box";if(d<=0){d=bH(a,b);if(d<0||d==null)d=a.style[b];if(bP.test(d))return d;e=f&&(p.support.boxSizingReliable||d===a.style[b]),d=parseFloat(d)||0}return d+b_(a,b,c||(f?"border":"content"),e)+"px"}function cb(a){if(bR[a])return bR[a];var b=p("<"+a+">").appendTo(e.body),c=b.css("display");b.remove();if(c==="none"||c===""){bI=e.body.appendChild(bI||p.extend(e.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!bJ||!bI.createElement)bJ=(bI.contentWindow||bI.contentDocument).document,bJ.write("<!doctype html><html><body>"),bJ.close();b=bJ.body.appendChild(bJ.createElement(a)),c=bH(b,"display"),e.body.removeChild(bI)}return bR[a]=c,c}function ch(a,b,c,d){var e;if(p.isArray(b))p.each(b,function(b,e){c||cd.test(a)?d(a,e):ch(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&p.type(b)==="object")for(e in b)ch(a+"["+e+"]",b[e],c,d);else d(a,b)}function cy(a){return function(b,c){typeof b!="string"&&(c=b,b="*");var d,e,f,g=b.toLowerCase().split(s),h=0,i=g.length;if(p.isFunction(c))for(;h<i;h++)d=g[h],f=/^\+/.test(d),f&&(d=d.substr(1)||"*"),e=a[d]=a[d]||[],e[f?"unshift":"push"](c)}}function cz(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h,i=a[f],j=0,k=i?i.length:0,l=a===cu;for(;j<k&&(l||!h);j++)h=i[j](c,d,e),typeof h=="string"&&(!l||g[h]?h=b:(c.dataTypes.unshift(h),h=cz(a,c,d,e,h,g)));return(l||!h)&&!g["*"]&&(h=cz(a,c,d,e,"*",g)),h}function cA(a,c){var d,e,f=p.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((f[d]?a:e||(e={}))[d]=c[d]);e&&p.extend(!0,a,e)}function cB(a,c,d){var e,f,g,h,i=a.contents,j=a.dataTypes,k=a.responseFields;for(f in k)f in d&&(c[k[f]]=d[f]);while(j[0]==="*")j.shift(),e===b&&(e=a.mimeType||c.getResponseHeader("content-type"));if(e)for(f in i)if(i[f]&&i[f].test(e)){j.unshift(f);break}if(j[0]in d)g=j[0];else{for(f in d){if(!j[0]||a.converters[f+" "+j[0]]){g=f;break}h||(h=f)}g=g||h}if(g)return g!==j[0]&&j.unshift(g),d[g]}function cC(a,b){var c,d,e,f,g=a.dataTypes.slice(),h=g[0],i={},j=0;a.dataFilter&&(b=a.dataFilter(b,a.dataType));if(g[1])for(c in a.converters)i[c.toLowerCase()]=a.converters[c];for(;e=g[++j];)if(e!=="*"){if(h!=="*"&&h!==e){c=i[h+" "+e]||i["* "+e];if(!c)for(d in i){f=d.split(" ");if(f[1]===e){c=i[h+" "+f[0]]||i["* "+f[0]];if(c){c===!0?c=i[d]:i[d]!==!0&&(e=f[0],g.splice(j--,0,e));break}}}if(c!==!0)if(c&&a["throws"])b=c(b);else try{b=c(b)}catch(k){return{state:"parsererror",error:c?k:"No conversion from "+h+" to "+e}}}h=e}return{state:"success",data:b}}function cK(){try{return new a.XMLHttpRequest}catch(b){}}function cL(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function cT(){return setTimeout(function(){cM=b},0),cM=p.now()}function cU(a,b){p.each(b,function(b,c){var d=(cS[b]||[]).concat(cS["*"]),e=0,f=d.length;for(;e<f;e++)if(d[e].call(a,b,c))return})}function cV(a,b,c){var d,e=0,f=0,g=cR.length,h=p.Deferred().always(function(){delete i.elem}),i=function(){var b=cM||cT(),c=Math.max(0,j.startTime+j.duration-b),d=1-(c/j.duration||0),e=0,f=j.tweens.length;for(;e<f;e++)j.tweens[e].run(d);return h.notifyWith(a,[j,d,c]),d<1&&f?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:p.extend({},b),opts:p.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:cM||cT(),duration:c.duration,tweens:[],createTween:function(b,c,d){var e=p.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(e),e},stop:function(b){var c=0,d=b?j.tweens.length:0;for(;c<d;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;cW(k,j.opts.specialEasing);for(;e<g;e++){d=cR[e].call(j,a,k,j.opts);if(d)return d}return cU(j,k),p.isFunction(j.opts.start)&&j.opts.start.call(a,j),p.fx.timer(p.extend(i,{anim:j,queue:j.opts.queue,elem:a})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}function cW(a,b){var c,d,e,f,g;for(c in a){d=p.camelCase(c),e=b[d],f=a[c],p.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=p.cssHooks[d];if(g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}}function cX(a,b,c){var d,e,f,g,h,i,j,k,l=this,m=a.style,n={},o=[],q=a.nodeType&&bY(a);c.queue||(j=p._queueHooks(a,"fx"),j.unqueued==null&&(j.unqueued=0,k=j.empty.fire,j.empty.fire=function(){j.unqueued||k()}),j.unqueued++,l.always(function(){l.always(function(){j.unqueued--,p.queue(a,"fx").length||j.empty.fire()})})),a.nodeType===1&&("height"in b||"width"in b)&&(c.overflow=[m.overflow,m.overflowX,m.overflowY],p.css(a,"display")==="inline"&&p.css(a,"float")==="none"&&(!p.support.inlineBlockNeedsLayout||cb(a.nodeName)==="inline"?m.display="inline-block":m.zoom=1)),c.overflow&&(m.overflow="hidden",p.support.shrinkWrapBlocks||l.done(function(){m.overflow=c.overflow[0],m.overflowX=c.overflow[1],m.overflowY=c.overflow[2]}));for(d in b){f=b[d];if(cO.exec(f)){delete b[d];if(f===(q?"hide":"show"))continue;o.push(d)}}g=o.length;if(g){h=p._data(a,"fxshow")||p._data(a,"fxshow",{}),q?p(a).show():l.done(function(){p(a).hide()}),l.done(function(){var b;p.removeData(a,"fxshow",!0);for(b in n)p.style(a,b,n[b])});for(d=0;d<g;d++)e=o[d],i=l.createTween(e,q?h[e]:0),n[e]=h[e]||p.style(a,e),e in h||(h[e]=i.start,q&&(i.end=i.start,i.start=e==="width"||e==="height"?1:0))}}function cY(a,b,c,d,e){return new cY.prototype.init(a,b,c,d,e)}function cZ(a,b){var c,d={height:a},e=0;for(;e<4;e+=2-b)c=bU[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function c_(a){return p.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}var c,d,e=a.document,f=a.location,g=a.navigator,h=a.jQuery,i=a.$,j=Array.prototype.push,k=Array.prototype.slice,l=Array.prototype.indexOf,m=Object.prototype.toString,n=Object.prototype.hasOwnProperty,o=String.prototype.trim,p=function(a,b){return new p.fn.init(a,b,c)},q=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,r=/\S/,s=/\s+/,t=r.test("В ")?/^[\s\xA0]+|[\s\xA0]+$/g:/^\s+|\s+$/g,u=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,y=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,z=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,A=/^-ms-/,B=/-([\da-z])/gi,C=function(a,b){return(b+"").toUpperCase()},D=function(){e.addEventListener?(e.removeEventListener("DOMContentLoaded",D,!1),p.ready()):e.readyState==="complete"&&(e.detachEvent("onreadystatechange",D),p.ready())},E={};p.fn=p.prototype={constructor:p,init:function(a,c,d){var f,g,h,i;if(!a)return this;if(a.nodeType)return this.context=this[0]=a,this.length=1,this;if(typeof a=="string"){a.charAt(0)==="<"&&a.charAt(a.length-1)===">"&&a.length>=3?f=[null,a,null]:f=u.exec(a);if(f&&(f[1]||!c)){if(f[1])return c=c instanceof p?c[0]:c,i=c&&c.nodeType?c.ownerDocument||c:e,a=p.parseHTML(f[1],i,!0),v.test(f[1])&&p.isPlainObject(c)&&this.attr.call(a,c,!0),p.merge(this,a);g=e.getElementById(f[2]);if(g&&g.parentNode){if(g.id!==f[2])return d.find(a);this.length=1,this[0]=g}return this.context=e,this.selector=a,this}return!c||c.jquery?(c||d).find(a):this.constructor(c).find(a)}return p.isFunction(a)?d.ready(a):(a.selector!==b&&(this.selector=a.selector,this.context=a.context),p.makeArray(a,this))},selector:"",jquery:"1.8.0",length:0,size:function(){return this.length},toArray:function(){return k.call(this)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=p.merge(this.constructor(),a);return d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")"),d},each:function(a,b){return p.each(this,a,b)},ready:function(a){return p.ready.promise().done(a),this},eq:function(a){return a=+a,a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(k.apply(this,arguments),"slice",k.call(arguments).join(","))},map:function(a){return this.pushStack(p.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:j,sort:[].sort,splice:[].splice},p.fn.init.prototype=p.fn,p.extend=p.fn.extend=function(){var a,c,d,e,f,g,h=arguments[0]||{},i=1,j=arguments.length,k=!1;typeof h=="boolean"&&(k=h,h=arguments[1]||{},i=2),typeof h!="object"&&!p.isFunction(h)&&(h={}),j===i&&(h=this,--i);for(;i<j;i++)if((a=arguments[i])!=null)for(c in a){d=h[c],e=a[c];if(h===e)continue;k&&e&&(p.isPlainObject(e)||(f=p.isArray(e)))?(f?(f=!1,g=d&&p.isArray(d)?d:[]):g=d&&p.isPlainObject(d)?d:{},h[c]=p.extend(k,g,e)):e!==b&&(h[c]=e)}return h},p.extend({noConflict:function(b){return a.$===p&&(a.$=i),b&&a.jQuery===p&&(a.jQuery=h),p},isReady:!1,readyWait:1,holdReady:function(a){a?p.readyWait++:p.ready(!0)},ready:function(a){if(a===!0?--p.readyWait:p.isReady)return;if(!e.body)return setTimeout(p.ready,1);p.isReady=!0;if(a!==!0&&--p.readyWait>0)return;d.resolveWith(e,[p]),p.fn.trigger&&p(e).trigger("ready").off("ready")},isFunction:function(a){return p.type(a)==="function"},isArray:Array.isArray||function(a){return p.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):E[m.call(a)]||"object"},isPlainObject:function(a){if(!a||p.type(a)!=="object"||a.nodeType||p.isWindow(a))return!1;try{if(a.constructor&&!n.call(a,"constructor")&&!n.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||n.call(a,d)},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},error:function(a){throw new Error(a)},parseHTML:function(a,b,c){var d;return!a||typeof a!="string"?null:(typeof b=="boolean"&&(c=b,b=0),b=b||e,(d=v.exec(a))?[b.createElement(d[1])]:(d=p.buildFragment([a],b,c?null:[]),p.merge([],(d.cacheable?p.clone(d.fragment):d.fragment).childNodes)))},parseJSON:function(b){if(!b||typeof b!="string")return null;b=p.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(w.test(b.replace(y,"@").replace(z,"]").replace(x,"")))return(new Function("return "+b))();p.error("Invalid JSON: "+b)},parseXML:function(c){var d,e;if(!c||typeof c!="string")return null;try{a.DOMParser?(e=new DOMParser,d=e.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(f){d=b}return(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&p.error("Invalid XML: "+c),d},noop:function(){},globalEval:function(b){b&&r.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(A,"ms-").replace(B,C)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var e,f=0,g=a.length,h=g===b||p.isFunction(a);if(d){if(h){for(e in a)if(c.apply(a[e],d)===!1)break}else for(;f<g;)if(c.apply(a[f++],d)===!1)break}else if(h){for(e in a)if(c.call(a[e],e,a[e])===!1)break}else for(;f<g;)if(c.call(a[f],f,a[f++])===!1)break;return a},trim:o?function(a){return a==null?"":o.call(a)}:function(a){return a==null?"":a.toString().replace(t,"")},makeArray:function(a,b){var c,d=b||[];return a!=null&&(c=p.type(a),a.length==null||c==="string"||c==="function"||c==="regexp"||p.isWindow(a)?j.call(d,a):p.merge(d,a)),d},inArray:function(a,b,c){var d;if(b){if(l)return l.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=c.length,e=a.length,f=0;if(typeof d=="number")for(;f<d;f++)a[e++]=c[f];else while(c[f]!==b)a[e++]=c[f++];return a.length=e,a},grep:function(a,b,c){var d,e=[],f=0,g=a.length;c=!!c;for(;f<g;f++)d=!!b(a[f],f),c!==d&&e.push(a[f]);return e},map:function(a,c,d){var e,f,g=[],h=0,i=a.length,j=a instanceof p||i!==b&&typeof i=="number"&&(i>0&&a[0]&&a[i-1]||i===0||p.isArray(a));if(j)for(;h<i;h++)e=c(a[h],h,d),e!=null&&(g[g.length]=e);else for(f in a)e=c(a[f],f,d),e!=null&&(g[g.length]=e);return g.concat.apply([],g)},guid:1,proxy:function(a,c){var d,e,f;return typeof c=="string"&&(d=a[c],c=a,a=d),p.isFunction(a)?(e=k.call(arguments,2),f=function(){return a.apply(c,e.concat(k.call(arguments)))},f.guid=a.guid=a.guid||f.guid||p.guid++,f):b},access:function(a,c,d,e,f,g,h){var i,j=d==null,k=0,l=a.length;if(d&&typeof d=="object"){for(k in d)p.access(a,c,k,d[k],1,g,e);f=1}else if(e!==b){i=h===b&&p.isFunction(e),j&&(i?(i=c,c=function(a,b,c){return i.call(p(a),c)}):(c.call(a,e),c=null));if(c)for(;k<l;k++)c(a[k],d,i?e.call(a[k],k,c(a[k],d)):e,h);f=1}return f?a:j?c.call(a):l?c(a[0],d):g},now:function(){return(new Date).getTime()}}),p.ready.promise=function(b){if(!d){d=p.Deferred();if(e.readyState==="complete"||e.readyState!=="loading"&&e.addEventListener)setTimeout(p.ready,1);else if(e.addEventListener)e.addEventListener("DOMContentLoaded",D,!1),a.addEventListener("load",p.ready,!1);else{e.attachEvent("onreadystatechange",D),a.attachEvent("onload",p.ready);var c=!1;try{c=a.frameElement==null&&e.documentElement}catch(f){}c&&c.doScroll&&function g(){if(!p.isReady){try{c.doScroll("left")}catch(a){return setTimeout(g,50)}p.ready()}}()}}return d.promise(b)},p.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){E["[object "+b+"]"]=b.toLowerCase()}),c=p(e);var F={};p.Callbacks=function(a){a=typeof a=="string"?F[a]||G(a):p.extend({},a);var c,d,e,f,g,h,i=[],j=!a.once&&[],k=function(b){c=a.memory&&b,d=!0,h=f||0,f=0,g=i.length,e=!0;for(;i&&h<g;h++)if(i[h].apply(b[0],b[1])===!1&&a.stopOnFalse){c=!1;break}e=!1,i&&(j?j.length&&k(j.shift()):c?i=[]:l.disable())},l={add:function(){if(i){var b=i.length;(function d(b){p.each(b,function(b,c){p.isFunction(c)&&(!a.unique||!l.has(c))?i.push(c):c&&c.length&&d(c)})})(arguments),e?g=i.length:c&&(f=b,k(c))}return this},remove:function(){return i&&p.each(arguments,function(a,b){var c;while((c=p.inArray(b,i,c))>-1)i.splice(c,1),e&&(c<=g&&g--,c<=h&&h--)}),this},has:function(a){return p.inArray(a,i)>-1},empty:function(){return i=[],this},disable:function(){return i=j=c=b,this},disabled:function(){return!i},lock:function(){return j=b,c||l.disable(),this},locked:function(){return!j},fireWith:function(a,b){return b=b||[],b=[a,b.slice?b.slice():b],i&&(!d||j)&&(e?j.push(b):k(b)),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!d}};return l},p.extend({Deferred:function(a){var b=[["resolve","done",p.Callbacks("once memory"),"resolved"],["reject","fail",p.Callbacks("once memory"),"rejected"],["notify","progress",p.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return p.Deferred(function(c){p.each(b,function(b,d){var f=d[0],g=a[b];e[d[1]](p.isFunction(g)?function(){var a=g.apply(this,arguments);a&&p.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f+"With"](this===e?c:this,[a])}:c[f])}),a=null}).promise()},promise:function(a){return typeof a=="object"?p.extend(a,d):d}},e={};return d.pipe=d.then,p.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[a^1][2].disable,b[2][2].lock),e[f[0]]=g.fire,e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=k.call(arguments),d=c.length,e=d!==1||a&&p.isFunction(a.promise)?d:0,f=e===1?a:p.Deferred(),g=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?k.call(arguments):d,c===h?f.notifyWith(b,c):--e||f.resolveWith(b,c)}},h,i,j;if(d>1){h=new Array(d),i=new Array(d),j=new Array(d);for(;b<d;b++)c[b]&&p.isFunction(c[b].promise)?c[b].promise().done(g(b,j,c)).fail(f.reject).progress(g(b,i,h)):--e}return e||f.resolveWith(j,c),f.promise()}}),p.support=function(){var b,c,d,f,g,h,i,j,k,l,m,n=e.createElement("div");n.setAttribute("className","t"),n.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",c=n.getElementsByTagName("*"),d=n.getElementsByTagName("a")[0],d.style.cssText="top:1px;float:left;opacity:.5";if(!c||!c.length||!d)return{};f=e.createElement("select"),g=f.appendChild(e.createElement("option")),h=n.getElementsByTagName("input")[0],b={leadingWhitespace:n.firstChild.nodeType===3,tbody:!n.getElementsByTagName("tbody").length,htmlSerialize:!!n.getElementsByTagName("link").length,style:/top/.test(d.getAttribute("style")),hrefNormalized:d.getAttribute("href")==="/a",opacity:/^0.5/.test(d.style.opacity),cssFloat:!!d.style.cssFloat,checkOn:h.value==="on",optSelected:g.selected,getSetAttribute:n.className!=="t",enctype:!!e.createElement("form").enctype,html5Clone:e.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:e.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},h.checked=!0,b.noCloneChecked=h.cloneNode(!0).checked,f.disabled=!0,b.optDisabled=!g.disabled;try{delete n.test}catch(o){b.deleteExpando=!1}!n.addEventListener&&n.attachEvent&&n.fireEvent&&(n.attachEvent("onclick",m=function(){b.noCloneEvent=!1}),n.cloneNode(!0).fireEvent("onclick"),n.detachEvent("onclick",m)),h=e.createElement("input"),h.value="t",h.setAttribute("type","radio"),b.radioValue=h.value==="t",h.setAttribute("checked","checked"),h.setAttribute("name","t"),n.appendChild(h),i=e.createDocumentFragment(),i.appendChild(n.lastChild),b.checkClone=i.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=h.checked,i.removeChild(h),i.appendChild(n);if(n.attachEvent)for(k in{submit:!0,change:!0,focusin:!0})j="on"+k,l=j in n,l||(n.setAttribute(j,"return;"),l=typeof n[j]=="function"),b[k+"Bubbles"]=l;return p(function(){var c,d,f,g,h="padding:0;margin:0;border:0;display:block;overflow:hidden;",i=e.getElementsByTagName("body")[0];if(!i)return;c=e.createElement("div"),c.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",i.insertBefore(c,i.firstChild),d=e.createElement("div"),c.appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",f=d.getElementsByTagName("td"),f[0].style.cssText="padding:0;margin:0;border:0;display:none",l=f[0].offsetHeight===0,f[0].style.display="",f[1].style.display="none",b.reliableHiddenOffsets=l&&f[0].offsetHeight===0,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",b.boxSizing=d.offsetWidth===4,b.doesNotIncludeMarginInBodyOffset=i.offsetTop!==1,a.getComputedStyle&&(b.pixelPosition=(a.getComputedStyle(d,null)||{}).top!=="1%",b.boxSizingReliable=(a.getComputedStyle(d,null)||{width:"4px"}).width==="4px",g=e.createElement("div"),g.style.cssText=d.style.cssText=h,g.style.marginRight=g.style.width="0",d.style.width="1px",d.appendChild(g),b.reliableMarginRight=!parseFloat((a.getComputedStyle(g,null)||{}).marginRight)),typeof d.style.zoom!="undefined"&&(d.innerHTML="",d.style.cssText=h+"width:1px;padding:1px;display:inline;zoom:1",b.inlineBlockNeedsLayout=d.offsetWidth===3,d.style.display="block",d.style.overflow="visible",d.innerHTML="<div></div>",d.firstChild.style.width="5px",b.shrinkWrapBlocks=d.offsetWidth!==3,c.style.zoom=1),i.removeChild(c),c=d=f=g=null}),i.removeChild(n),c=d=f=g=h=i=n=null,b}();var H=/^(?:\{.*\}|\[.*\])$/,I=/([A-Z])/g;p.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(p.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){return a=a.nodeType?p.cache[a[p.expando]]:a[p.expando],!!a&&!K(a)},data:function(a,c,d,e){if(!p.acceptData(a))return;var f,g,h=p.expando,i=typeof c=="string",j=a.nodeType,k=j?p.cache:a,l=j?a[h]:a[h]&&h;if((!l||!k[l]||!e&&!k[l].data)&&i&&d===b)return;l||(j?a[h]=l=p.deletedIds.pop()||++p.uuid:l=h),k[l]||(k[l]={},j||(k[l].toJSON=p.noop));if(typeof c=="object"||typeof c=="function")e?k[l]=p.extend(k[l],c):k[l].data=p.extend(k[l].data,c);return f=k[l],e||(f.data||(f.data={}),f=f.data),d!==b&&(f[p.camelCase(c)]=d),i?(g=f[c],g==null&&(g=f[p.camelCase(c)])):g=f,g},removeData:function(a,b,c){if(!p.acceptData(a))return;var d,e,f,g=a.nodeType,h=g?p.cache:a,i=g?a[p.expando]:p.expando;if(!h[i])return;if(b){d=c?h[i]:h[i].data;if(d){p.isArray(b)||(b in d?b=[b]:(b=p.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,f=b.length;e<f;e++)delete d[b[e]];if(!(c?K:p.isEmptyObject)(d))return}}if(!c){delete h[i].data;if(!K(h[i]))return}g?p.cleanData([a],!0):p.support.deleteExpando||h!=h.window?delete h[i]:h[i]=null},_data:function(a,b,c){return p.data(a,b,c,!0)},acceptData:function(a){var b=a.nodeName&&p.noData[a.nodeName.toLowerCase()];return!b||b!==!0&&a.getAttribute("classid")===b}}),p.fn.extend({data:function(a,c){var d,e,f,g,h,i=this[0],j=0,k=null;if(a===b){if(this.length){k=p.data(i);if(i.nodeType===1&&!p._data(i,"parsedAttrs")){f=i.attributes;for(h=f.length;j<h;j++)g=f[j].name,g.indexOf("data-")===0&&(g=p.camelCase(g.substring(5)),J(i,g,k[g]));p._data(i,"parsedAttrs",!0)}}return k}return typeof a=="object"?this.each(function(){p.data(this,a)}):(d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!",p.access(this,function(c){if(c===b)return k=this.triggerHandler("getData"+e,[d[0]]),k===b&&i&&(k=p.data(i,a),k=J(i,a,k)),k===b&&d[1]?this.data(d[0]):k;d[1]=c,this.each(function(){var b=p(this);b.triggerHandler("setData"+e,d),p.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1))},removeData:function(a){return this.each(function(){p.removeData(this,a)})}}),p.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=p._data(a,b),c&&(!d||p.isArray(c)?d=p._data(a,b,p.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=p.queue(a,b),d=c.shift(),e=p._queueHooks(a,b),f=function(){p.dequeue(a,b)};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),delete e.stop,d.call(a,f,e)),!c.length&&e&&e.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return p._data(a,c)||p._data(a,c,{empty:p.Callbacks("once memory").add(function(){p.removeData(a,b+"queue",!0),p.removeData(a,c,!0)})})}}),p.fn.extend({queue:function(a,c){var d=2;return typeof a!="string"&&(c=a,a="fx",d--),arguments.length<d?p.queue(this[0],a):c===b?this:this.each(function(){var b=p.queue(this,a,c);p._queueHooks(this,a),a==="fx"&&b[0]!=="inprogress"&&p.dequeue(this,a)})},dequeue:function(a){return this.each(function(){p.dequeue(this,a)})},delay:function(a,b){return a=p.fx?p.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){var d,e=1,f=p.Deferred(),g=this,h=this.length,i=function(){--e||f.resolveWith(g,[g])};typeof a!="string"&&(c=a,a=b),a=a||"fx";while(h--)(d=p._data(g[h],a+"queueHooks"))&&d.empty&&(e++,d.empty.add(i));return i(),f.promise(c)}});var L,M,N,O=/[\t\r\n]/g,P=/\r/g,Q=/^(?:button|input)$/i,R=/^(?:button|input|object|select|textarea)$/i,S=/^a(?:rea|)$/i,T=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,U=p.support.getSetAttribute;p.fn.extend({attr:function(a,b){return p.access(this,p.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){p.removeAttr(this,a)})},prop:function(a,b){return p.access(this,p.prop,a,b,arguments.length>1)},removeProp:function(a){return a=p.propFix[a]||a,this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,f,g,h;if(p.isFunction(a))return this.each(function(b){p(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(s);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{f=" "+e.className+" ";for(g=0,h=b.length;g<h;g++)~f.indexOf(" "+b[g]+" ")||(f+=b[g]+" ");e.className=p.trim(f)}}}return this},removeClass:function(a){var c,d,e,f,g,h,i;if(p.isFunction(a))return this.each(function(b){p(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(s);for(h=0,i=this.length;h<i;h++){e=this[h];if(e.nodeType===1&&e.className){d=(" "+e.className+" ").replace(O," ");for(f=0,g=c.length;f<g;f++)while(d.indexOf(" "+c[f]+" ")>-1)d=d.replace(" "+c[f]+" "," ");e.className=a?p.trim(d):""}}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";return p.isFunction(a)?this.each(function(c){p(this).toggleClass(a.call(this,c,this.className,b),b)}):this.each(function(){if(c==="string"){var e,f=0,g=p(this),h=b,i=a.split(s);while(e=i[f++])h=d?h:!g.hasClass(e),g[h?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&p._data(this,"__className__",this.className),this.className=this.className||a===!1?"":p._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(O," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,f=this[0];if(!arguments.length){if(f)return c=p.valHooks[f.type]||p.valHooks[f.nodeName.toLowerCase()],c&&"get"in c&&(d=c.get(f,"value"))!==b?d:(d=f.value,typeof d=="string"?d.replace(P,""):d==null?"":d);return}return e=p.isFunction(a),this.each(function(d){var f,g=p(this);if(this.nodeType!==1)return;e?f=a.call(this,d,g.val()):f=a,f==null?f="":typeof f=="number"?f+="":p.isArray(f)&&(f=p.map(f,function(a){return a==null?"":a+""})),c=p.valHooks[this.type]||p.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,f,"value")===b)this.value=f})}}),p.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,f=a.selectedIndex,g=[],h=a.options,i=a.type==="select-one";if(f<0)return null;c=i?f:0,d=i?f+1:h.length;for(;c<d;c++){e=h[c];if(e.selected&&(p.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!p.nodeName(e.parentNode,"optgroup"))){b=p(e).val();if(i)return b;g.push(b)}}return i&&!g.length&&h.length?p(h[f]).val():g},set:function(a,b){var c=p.makeArray(b);return p(a).find("option").each(function(){this.selected=p.inArray(p(this).val(),c)>=0}),c.length||(a.selectedIndex=-1),c}}},attrFn:{},attr:function(a,c,d,e){var f,g,h,i=a.nodeType;if(!a||i===3||i===8||i===2)return;if(e&&p.isFunction(p.fn[c]))return p(a)[c](d);if(typeof a.getAttribute=="undefined")return p.prop(a,c,d);h=i!==1||!p.isXMLDoc(a),h&&(c=c.toLowerCase(),g=p.attrHooks[c]||(T.test(c)?M:L));if(d!==b){if(d===null){p.removeAttr(a,c);return}return g&&"set"in g&&h&&(f=g.set(a,d,c))!==b?f:(a.setAttribute(c,""+d),d)}return g&&"get"in g&&h&&(f=g.get(a,c))!==null?f:(f=a.getAttribute(c),f===null?b:f)},removeAttr:function(a,b){var c,d,e,f,g=0;if(b&&a.nodeType===1){d=b.split(s);for(;g<d.length;g++)e=d[g],e&&(c=p.propFix[e]||e,f=T.test(e),f||p.attr(a,e,""),a.removeAttribute(U?e:c),f&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(Q.test(a.nodeName)&&a.parentNode)p.error("type property can't be changed");else if(!p.support.radioValue&&b==="radio"&&p.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}},value:{get:function(a,b){return L&&p.nodeName(a,"button")?L.get(a,b):b in a?a.value:null},set:function(a,b,c){if(L&&p.nodeName(a,"button"))return L.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,f,g,h=a.nodeType;if(!a||h===3||h===8||h===2)return;return g=h!==1||!p.isXMLDoc(a),g&&(c=p.propFix[c]||c,f=p.propHooks[c]),d!==b?f&&"set"in f&&(e=f.set(a,d,c))!==b?e:a[c]=d:f&&"get"in f&&(e=f.get(a,c))!==null?e:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):R.test(a.nodeName)||S.test(a.nodeName)&&a.href?0:b}}}}),M={get:function(a,c){var d,e=p.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;return b===!1?p.removeAttr(a,c):(d=p.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase())),c}},U||(N={name:!0,id:!0,coords:!0},L=p.valHooks.button={get:function(a,c){var d;return d=a.getAttributeNode(c),d&&(N[c]?d.value!=="":d.specified)?d.value:b},set:function(a,b,c){var d=a.getAttributeNode(c);return d||(d=e.createAttribute(c),a.setAttributeNode(d)),d.value=b+""}},p.each(["width","height"],function(a,b){p.attrHooks[b]=p.extend(p.attrHooks[b],{set:function(a,c){if(c==="")return a.setAttribute(b,"auto"),c}})}),p.attrHooks.contenteditable={get:L.get,set:function(a,b,c){b===""&&(b="false"),L.set(a,b,c)}}),p.support.hrefNormalized||p.each(["href","src","width","height"],function(a,c){p.attrHooks[c]=p.extend(p.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),p.support.style||(p.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),p.support.optSelected||(p.propHooks.selected=p.extend(p.propHooks.selected,{get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}})),p.support.enctype||(p.propFix.enctype="encoding"),p.support.checkOn||p.each(["radio","checkbox"],function(){p.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),p.each(["radio","checkbox"],function(){p.valHooks[this]=p.extend(p.valHooks[this],{set:function(a,b){if(p.isArray(b))return a.checked=p.inArray(p(a).val(),b)>=0}})});var V=/^(?:textarea|input|select)$/i,W=/^([^\.]*|)(?:\.(.+)|)$/,X=/(?:^|\s)hover(\.\S+|)\b/,Y=/^key/,Z=/^(?:mouse|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=function(a){return p.event.special.hover?a:a.replace(X,"mouseenter$1 mouseleave$1")};p.event={add:function(a,c,d,e,f){var g,h,i,j,k,l,m,n,o,q,r;if(a.nodeType===3||a.nodeType===8||!c||!d||!(g=p._data(a)))return;d.handler&&(o=d,d=o.handler,f=o.selector),d.guid||(d.guid=p.guid++),i=g.events,i||(g.events=i={}),h=g.handle,h||(g.handle=h=function(a){return typeof p!="undefined"&&(!a||p.event.triggered!==a.type)?p.event.dispatch.apply(h.elem,arguments):b},h.elem=a),c=p.trim(_(c)).split(" ");for(j=0;j<c.length;j++){k=W.exec(c[j])||[],l=k[1],m=(k[2]||"").split(".").sort(),r=p.event.special[l]||{},l=(f?r.delegateType:r.bindType)||l,r=p.event.special[l]||{},n=p.extend({type:l,origType:k[1],data:e,handler:d,guid:d.guid,selector:f,namespace:m.join(".")},o),q=i[l];if(!q){q=i[l]=[],q.delegateCount=0;if(!r.setup||r.setup.call(a,e,m,h)===!1)a.addEventListener?a.addEventListener(l,h,!1):a.attachEvent&&a.attachEvent("on"+l,h)}r.add&&(r.add.call(a,n),n.handler.guid||(n.handler.guid=d.guid)),f?q.splice(q.delegateCount++,0,n):q.push(n),p.event.global[l]=!0}a=null},global:{},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,q,r=p.hasData(a)&&p._data(a);if(!r||!(m=r.events))return;b=p.trim(_(b||"")).split(" ");for(f=0;f<b.length;f++){g=W.exec(b[f])||[],h=i=g[1],j=g[2];if(!h){for(h in m)p.event.remove(a,h+b[f],c,d,!0);continue}n=p.event.special[h]||{},h=(d?n.delegateType:n.bindType)||h,o=m[h]||[],k=o.length,j=j?new RegExp("(^|\\.)"+j.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(l=0;l<o.length;l++)q=o[l],(e||i===q.origType)&&(!c||c.guid===q.guid)&&(!j||j.test(q.namespace))&&(!d||d===q.selector||d==="**"&&q.selector)&&(o.splice(l--,1),q.selector&&o.delegateCount--,n.remove&&n.remove.call(a,q));o.length===0&&k!==o.length&&((!n.teardown||n.teardown.call(a,j,r.handle)===!1)&&p.removeEvent(a,h,r.handle),delete m[h])}p.isEmptyObject(m)&&(delete r.handle,p.removeData(a,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,f,g){if(!f||f.nodeType!==3&&f.nodeType!==8){var h,i,j,k,l,m,n,o,q,r,s=c.type||c,t=[];if($.test(s+p.event.triggered))return;s.indexOf("!")>=0&&(s=s.slice(0,-1),i=!0),s.indexOf(".")>=0&&(t=s.split("."),s=t.shift(),t.sort());if((!f||p.event.customEvent[s])&&!p.event.global[s])return;c=typeof c=="object"?c[p.expando]?c:new p.Event(s,c):new p.Event(s),c.type=s,c.isTrigger=!0,c.exclusive=i,c.namespace=t.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+t.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,m=s.indexOf(":")<0?"on"+s:"";if(!f){h=p.cache;for(j in h)h[j].events&&h[j].events[s]&&p.event.trigger(c,d,h[j].handle.elem,!0);return}c.result=b,c.target||(c.target=f),d=d!=null?p.makeArray(d):[],d.unshift(c),n=p.event.special[s]||{};if(n.trigger&&n.trigger.apply(f,d)===!1)return;q=[[f,n.bindType||s]];if(!g&&!n.noBubble&&!p.isWindow(f)){r=n.delegateType||s,k=$.test(r+s)?f:f.parentNode;for(l=f;k;k=k.parentNode)q.push([k,r]),l=k;l===(f.ownerDocument||e)&&q.push([l.defaultView||l.parentWindow||a,r])}for(j=0;j<q.length&&!c.isPropagationStopped();j++)k=q[j][0],c.type=q[j][1],o=(p._data(k,"events")||{})[c.type]&&p._data(k,"handle"),o&&o.apply(k,d),o=m&&k[m],o&&p.acceptData(k)&&o.apply(k,d)===!1&&c.preventDefault();return c.type=s,!g&&!c.isDefaultPrevented()&&(!n._default||n._default.apply(f.ownerDocument,d)===!1)&&(s!=="click"||!p.nodeName(f,"a"))&&p.acceptData(f)&&m&&f[s]&&(s!=="focus"&&s!=="blur"||c.target.offsetWidth!==0)&&!p.isWindow(f)&&(l=f[m],l&&(f[m]=null),p.event.triggered=s,f[s](),p.event.triggered=b,l&&(f[m]=l)),c.result}return},dispatch:function(c){c=p.event.fix(c||a.event);var d,e,f,g,h,i,j,k,l,m,n,o=(p._data(this,"events")||{})[c.type]||[],q=o.delegateCount,r=[].slice.call(arguments),s=!c.exclusive&&!c.namespace,t=p.event.special[c.type]||{},u=[];r[0]=c,c.delegateTarget=this;if(t.preDispatch&&t.preDispatch.call(this,c)===!1)return;if(q&&(!c.button||c.type!=="click")){g=p(this),g.context=this;for(f=c.target;f!=this;f=f.parentNode||this)if(f.disabled!==!0||c.type!=="click"){i={},k=[],g[0]=f;for(d=0;d<q;d++)l=o[d],m=l.selector,i[m]===b&&(i[m]=g.is(m)),i[m]&&k.push(l);k.length&&u.push({elem:f,matches:k})}}o.length>q&&u.push({elem:this,matches:o.slice(q)});for(d=0;d<u.length&&!c.isPropagationStopped();d++){j=u[d],c.currentTarget=j.elem;for(e=0;e<j.matches.length&&!c.isImmediatePropagationStopped();e++){l=j.matches[e];if(s||!c.namespace&&!l.namespace||c.namespace_re&&c.namespace_re.test(l.namespace))c.data=l.data,c.handleObj=l,h=((p.event.special[l.origType]||{}).handle||l.handler).apply(j.elem,r),h!==b&&(c.result=h,h===!1&&(c.preventDefault(),c.stopPropagation()))}}return t.postDispatch&&t.postDispatch.call(this,c),c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,c){var d,f,g,h=c.button,i=c.fromElement;return a.pageX==null&&c.clientX!=null&&(d=a.target.ownerDocument||e,f=d.documentElement,g=d.body,a.pageX=c.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=c.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?c.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0),a}},fix:function(a){if(a[p.expando])return a;var b,c,d=a,f=p.event.fixHooks[a.type]||{},g=f.props?this.props.concat(f.props):this.props;a=p.Event(d);for(b=g.length;b;)c=g[--b],a[c]=d[c];return a.target||(a.target=d.srcElement||e),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,f.filter?f.filter(a,d):a},special:{ready:{setup:p.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){p.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=p.extend(new p.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?p.event.trigger(e,null,b):p.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},p.event.handle=p.event.dispatch,p.removeEvent=e.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]=="undefined"&&(a[d]=null),a.detachEvent(d,c))},p.Event=function(a,b){if(this instanceof p.Event)a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?bb:ba):this.type=a,b&&p.extend(this,b),this.timeStamp=a&&a.timeStamp||p.now(),this[p.expando]=!0;else return new p.Event(a,b)},p.Event.prototype={preventDefault:function(){this.isDefaultPrevented=bb;var a=this.originalEvent;if(!a)return;a.preventDefault?a.preventDefault():a.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=bb;var a=this.originalEvent;if(!a)return;a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=bb,this.stopPropagation()},isDefaultPrevented:ba,isPropagationStopped:ba,isImmediatePropagationStopped:ba},p.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){p.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj,g=f.selector;if(!e||e!==d&&!p.contains(d,e))a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b;return c}}}),p.support.submitBubbles||(p.event.special.submit={setup:function(){if(p.nodeName(this,"form"))return!1;p.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=p.nodeName(c,"input")||p.nodeName(c,"button")?c.form:b;d&&!p._data(d,"_submit_attached")&&(p.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),p._data(d,"_submit_attached",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&p.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(p.nodeName(this,"form"))return!1;p.event.remove(this,"._submit")}}),p.support.changeBubbles||(p.event.special.change={setup:function(){if(V.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")p.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),p.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),p.event.simulate("change",this,a,!0)});return!1}p.event.add(this,"beforeactivate._change",function(a){var b=a.target;V.test(b.nodeName)&&!p._data(b,"_change_attached")&&(p.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&p.event.simulate("change",this.parentNode,a,!0)}),p._data(b,"_change_attached",!0))})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){return p.event.remove(this,"._change"),V.test(this.nodeName)}}),p.support.focusinBubbles||p.each({focus:"focusin",blur:"focusout"},function(a,b){var c=0,d=function(a){p.event.simulate(b,a.target,p.event.fix(a),!0)};p.event.special[b]={setup:function(){c++===0&&e.addEventListener(a,d,!0)},teardown:function(){--c===0&&e.removeEventListener(a,d,!0)}}}),p.fn.extend({on:function(a,c,d,e,f){var g,h;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(h in a)this.on(h,c,d,a[h],f);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=ba;else if(!e)return this;return f===1&&(g=e,e=function(a){return p().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=p.guid++)),this.each(function(){p.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){var e,f;if(a&&a.preventDefault&&a.handleObj)return e=a.handleObj,p(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler),this;if(typeof a=="object"){for(f in a)this.off(f,c,a[f]);return this}if(c===!1||typeof c=="function")d=c,c=b;return d===!1&&(d=ba),this.each(function(){p.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){return p(this.context).on(a,this.selector,b,c),this},die:function(a,b){return p(this.context).off(a,this.selector||"**",b),this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a||"**",c)},trigger:function(a,b){return this.each(function(){p.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return p.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||p.guid++,d=0,e=function(c){var e=(p._data(this,"lastToggle"+a.guid)||0)%d;return p._data(this,"lastToggle"+a.guid,e+1),c.preventDefault(),b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){p.fn[b]=function(a,c){return c==null&&(c=a,a=null),arguments.length>0?this.on(b,null,a,c):this.trigger(b)},Y.test(b)&&(p.event.fixHooks[b]=p.event.keyHooks),Z.test(b)&&(p.event.fixHooks[b]=p.event.mouseHooks)}),function(a,b){function bd(a,b,c,d){var e=0,f=b.length;for(;e<f;e++)Z(a,b[e],c,d)}function be(a,b,c,d,e,f){var g,h=$.setFilters[b.toLowerCase()];return h||Z.error(b),(a||!(g=e))&&bd(a||"*",d,g=[],e),g.length>0?h(g,c,f):[]}function bf(a,c,d,e,f){var g,h,i,j,k,l,m,n,p=0,q=f.length,s=L.POS,t=new RegExp("^"+s.source+"(?!"+r+")","i"),u=function(){var a=1,c=arguments.length-2;for(;a<c;a++)arguments[a]===b&&(g[a]=b)};for(;p<q;p++){s.exec(""),a=f[p],j=[],i=0,k=e;while(g=s.exec(a)){n=s.lastIndex=g.index+g[0].length;if(n>i){m=a.slice(i,g.index),i=n,l=[c],B.test(m)&&(k&&(l=k),k=e);if(h=H.test(m))m=m.slice(0,-5).replace(B,"$&*");g.length>1&&g[0].replace(t,u),k=be(m,g[1],g[2],l,k,h)}}k?(j=j.concat(k),(m=a.slice(i))&&m!==")"?B.test(m)?bd(m,j,d,e):Z(m,c,d,e?e.concat(k):k):o.apply(d,j)):Z(a,c,d,e)}return q===1?d:Z.uniqueSort(d)}function bg(a,b,c){var d,e,f,g=[],i=0,j=D.exec(a),k=!j.pop()&&!j.pop(),l=k&&a.match(C)||[""],m=$.preFilter,n=$.filter,o=!c&&b!==h;for(;(e=l[i])!=null&&k;i++){g.push(d=[]),o&&(e=" "+e);while(e){k=!1;if(j=B.exec(e))e=e.slice(j[0].length),k=d.push({part:j.pop().replace(A," "),captures:j});for(f in n)(j=L[f].exec(e))&&(!m[f]||(j=m[f](j,b,c)))&&(e=e.slice(j.shift().length),k=d.push({part:f,captures:j}));if(!k)break}}return k||Z.error(a),g}function bh(a,b,e){var f=b.dir,g=m++;return a||(a=function(a){return a===e}),b.first?function(b,c){while(b=b[f])if(b.nodeType===1)return a(b,c)&&b}:function(b,e){var h,i=g+"."+d,j=i+"."+c;while(b=b[f])if(b.nodeType===1){if((h=b[q])===j)return b.sizset;if(typeof h=="string"&&h.indexOf(i)===0){if(b.sizset)return b}else{b[q]=j;if(a(b,e))return b.sizset=!0,b;b.sizset=!1}}}}function bi(a,b){return a?function(c,d){var e=b(c,d);return e&&a(e===!0?c:e,d)}:b}function bj(a,b,c){var d,e,f=0;for(;d=a[f];f++)$.relative[d.part]?e=bh(e,$.relative[d.part],b):(d.captures.push(b,c),e=bi(e,$.filter[d.part].apply(null,d.captures)));return e}function bk(a){return function(b,c){var d,e=0;for(;d=a[e];e++)if(d(b,c))return!0;return!1}}var c,d,e,f,g,h=a.document,i=h.documentElement,j="undefined",k=!1,l=!0,m=0,n=[].slice,o=[].push,q=("sizcache"+Math.random()).replace(".",""),r="[\\x20\\t\\r\\n\\f]",s="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",t=s.replace("w","w#"),u="([*^$|!~]?=)",v="\\["+r+"*("+s+")"+r+"*(?:"+u+r+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+t+")|)|)"+r+"*\\]",w=":("+s+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|((?:[^,]|\\\\,|(?:,(?=[^\\[]*\\]))|(?:,(?=[^\\(]*\\))))*))\\)|)",x=":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\)|)(?=[^-]|$)",y=r+"*([\\x20\\t\\r\\n\\f>+~])"+r+"*",z="(?=[^\\x20\\t\\r\\n\\f])(?:\\\\.|"+v+"|"+w.replace(2,7)+"|[^\\\\(),])+",A=new RegExp("^"+r+"+|((?:^|[^\\\\])(?:\\\\.)*)"+r+"+$","g"),B=new RegExp("^"+y),C=new RegExp(z+"?(?="+r+"*,|$)","g"),D=new RegExp("^(?:(?!,)(?:(?:^|,)"+r+"*"+z+")*?|"+r+"*(.*?))(\\)|$)"),E=new RegExp(z.slice(19,-6)+"\\x20\\t\\r\\n\\f>+~])+|"+y,"g"),F=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,G=/[\x20\t\r\n\f]*[+~]/,H=/:not\($/,I=/h\d/i,J=/input|select|textarea|button/i,K=/\\(?!\\)/g,L={ID:new RegExp("^#("+s+")"),CLASS:new RegExp("^\\.("+s+")"),NAME:new RegExp("^\\[name=['\"]?("+s+")['\"]?\\]"),TAG:new RegExp("^("+s.replace("[-","[-\\*")+")"),ATTR:new RegExp("^"+v),PSEUDO:new RegExp("^"+w),CHILD:new RegExp("^:(only|nth|last|first)-child(?:\\("+r+"*(even|odd|(([+-]|)(\\d*)n|)"+r+"*(?:([+-]|)"+r+"*(\\d+)|))"+r+"*\\)|)","i"),POS:new RegExp(x,"ig"),needsContext:new RegExp("^"+r+"*[>+~]|"+x,"i")},M={},N=[],O={},P=[],Q=function(a){return a.sizzleFilter=!0,a},R=function(a){return function(b){return b.nodeName.toLowerCase()==="input"&&b.type===a}},S=function(a){return function(b){var c=b.nodeName.toLowerCase();return(c==="input"||c==="button")&&b.type===a}},T=function(a){var b=!1,c=h.createElement("div");try{b=a(c)}catch(d){}return c=null,b},U=T(function(a){a.innerHTML="<select></select>";var b=typeof a.lastChild.getAttribute("multiple");return b!=="boolean"&&b!=="string"}),V=T(function(a){a.id=q+0,a.innerHTML="<a name='"+q+"'></a><div name='"+q+"'></div>",i.insertBefore(a,i.firstChild);var b=h.getElementsByName&&h.getElementsByName(q).length===2+h.getElementsByName(q+0).length;return g=!h.getElementById(q),i.removeChild(a),b}),W=T(function(a){return a.appendChild(h.createComment("")),a.getElementsByTagName("*").length===0}),X=T(function(a){return a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!==j&&a.firstChild.getAttribute("href")==="#"}),Y=T(function(a){return a.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!a.getElementsByClassName||a.getElementsByClassName("e").length===0?!1:(a.lastChild.className="e",a.getElementsByClassName("e").length!==1)}),Z=function(a,b,c,d){c=c||[],b=b||h;var e,f,g,i,j=b.nodeType;if(j!==1&&j!==9)return[];if(!a||typeof a!="string")return c;g=ba(b);if(!g&&!d)if(e=F.exec(a))if(i=e[1]){if(j===9){f=b.getElementById(i);if(!f||!f.parentNode)return c;if(f.id===i)return c.push(f),c}else if(b.ownerDocument&&(f=b.ownerDocument.getElementById(i))&&bb(b,f)&&f.id===i)return c.push(f),c}else{if(e[2])return o.apply(c,n.call(b.getElementsByTagName(a),0)),c;if((i=e[3])&&Y&&b.getElementsByClassName)return o.apply(c,n.call(b.getElementsByClassName(i),0)),c}return bm(a,b,c,d,g)},$=Z.selectors={cacheLength:50,match:L,order:["ID","TAG"],attrHandle:{},createPseudo:Q,find:{ID:g?function(a,b,c){if(typeof b.getElementById!==j&&!c){var d=b.getElementById(a);return d&&d.parentNode?[d]:[]}}:function(a,c,d){if(typeof c.getElementById!==j&&!d){var e=c.getElementById(a);return e?e.id===a||typeof e.getAttributeNode!==j&&e.getAttributeNode("id").value===a?[e]:b:[]}},TAG:W?function(a,b){if(typeof b.getElementsByTagName!==j)return b.getElementsByTagName(a)}:function(a,b){var c=b.getElementsByTagName(a);if(a==="*"){var d,e=[],f=0;for(;d=c[f];f++)d.nodeType===1&&e.push(d);return e}return c}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(K,""),a[3]=(a[4]||a[5]||"").replace(K,""),a[2]==="~="&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),a[1]==="nth"?(a[2]||Z.error(a[0]),a[3]=+(a[3]?a[4]+(a[5]||1):2*(a[2]==="even"||a[2]==="odd")),a[4]=+(a[6]+a[7]||a[2]==="odd")):a[2]&&Z.error(a[0]),a},PSEUDO:function(a){var b,c=a[4];return L.CHILD.test(a[0])?null:(c&&(b=D.exec(c))&&b.pop()&&(a[0]=a[0].slice(0,b[0].length-c.length-1),c=b[0].slice(0,-1)),a.splice(2,3,c||a[3]),a)}},filter:{ID:g?function(a){return a=a.replace(K,""),function(b){return b.getAttribute("id")===a}}:function(a){return a=a.replace(K,""),function(b){var c=typeof b.getAttributeNode!==j&&b.getAttributeNode("id");return c&&c.value===a}},TAG:function(a){return a==="*"?function(){return!0}:(a=a.replace(K,"").toLowerCase(),function(b){return b.nodeName&&b.nodeName.toLowerCase()===a})},CLASS:function(a){var b=M[a];return b||(b=M[a]=new RegExp("(^|"+r+")"+a+"("+r+"|$)"),N.push(a),N.length>$.cacheLength&&delete M[N.shift()]),function(a){return b.test(a.className||typeof a.getAttribute!==j&&a.getAttribute("class")||"")}},ATTR:function(a,b,c){return b?function(d){var e=Z.attr(d,a),f=e+"";if(e==null)return b==="!=";switch(b){case"=":return f===c;case"!=":return f!==c;case"^=":return c&&f.indexOf(c)===0;case"*=":return c&&f.indexOf(c)>-1;case"$=":return c&&f.substr(f.length-c.length)===c;case"~=":return(" "+f+" ").indexOf(c)>-1;case"|=":return f===c||f.substr(0,c.length+1)===c+"-"}}:function(b){return Z.attr(b,a)!=null}},CHILD:function(a,b,c,d){if(a==="nth"){var e=m++;return function(a){var b,f,g=0,h=a;if(c===1&&d===0)return!0;b=a.parentNode;if(b&&(b[q]!==e||!a.sizset)){for(h=b.firstChild;h;h=h.nextSibling)if(h.nodeType===1){h.sizset=++g;if(h===a)break}b[q]=e}return f=a.sizset-d,c===0?f===0:f%c===0&&f/c>=0}}return function(b){var c=b;switch(a){case"only":case"first":while(c=c.previousSibling)if(c.nodeType===1)return!1;if(a==="first")return!0;c=b;case"last":while(c=c.nextSibling)if(c.nodeType===1)return!1;return!0}}},PSEUDO:function(a,b,c,d){var e=$.pseudos[a]||$.pseudos[a.toLowerCase()];return e||Z.error("unsupported pseudo: "+a),e.sizzleFilter?e(b,c,d):e}},pseudos:{not:Q(function(a,b,c){var d=bl(a.replace(A,"$1"),b,c);return function(a){return!d(a)}}),enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&!!a.checked||b==="option"&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},parent:function(a){return!$.pseudos.empty(a)},empty:function(a){var b;a=a.firstChild;while(a){if(a.nodeName>"@"||(b=a.nodeType)===3||b===4)return!1;a=a.nextSibling}return!0},contains:Q(function(a){return function(b){return(b.textContent||b.innerText||bc(b)).indexOf(a)>-1}}),has:Q(function(a){return function(b){return Z(a,b).length>0}}),header:function(a){return I.test(a.nodeName)},text:function(a){var b,c;return a.nodeName.toLowerCase()==="input"&&(b=a.type)==="text"&&((c=a.getAttribute("type"))==null||c.toLowerCase()===b)},radio:R("radio"),checkbox:R("checkbox"),file:R("file"),password:R("password"),image:R("image"),submit:S("submit"),reset:S("reset"),button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&a.type==="button"||b==="button"},input:function(a){return J.test(a.nodeName)},focus:function(a){var b=a.ownerDocument;return a===b.activeElement&&(!b.hasFocus||b.hasFocus())&&(!!a.type||!!a.href)},active:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b,c){return c?a.slice(1):[a[0]]},last:function(a,b,c){var d=a.pop();return c?a:[d]},even:function(a,b,c){var d=[],e=c?1:0,f=a.length;for(;e<f;e=e+2)d.push(a[e]);return d},odd:function(a,b,c){var d=[],e=c?0:1,f=a.length;for(;e<f;e=e+2)d.push(a[e]);return d},lt:function(a,b,c){return c?a.slice(+b):a.slice(0,+b)},gt:function(a,b,c){return c?a.slice(0,+b+1):a.slice(+b+1)},eq:function(a,b,c){var d=a.splice(+b,1);return c?a:d}}};$.setFilters.nth=$.setFilters.eq,$.filters=$.pseudos,X||($.attrHandle={href:function(a){return a.getAttribute("href",2)},type:function(a){return a.getAttribute("type")}}),V&&($.order.push("NAME"),$.find.NAME=function(a,b){if(typeof b.getElementsByName!==j)return b.getElementsByName(a)}),Y&&($.order.splice(1,0,"CLASS"),$.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!==j&&!c)return b.getElementsByClassName(a)});try{n.call(i.childNodes,0)[0].nodeType}catch(_){n=function(a){var b,c=[];for(;b=this[a];a++)c.push(b);return c}}var ba=Z.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?b.nodeName!=="HTML":!1},bb=Z.contains=i.compareDocumentPosition?function(a,b){return!!(a.compareDocumentPosition(b)&16)}:i.contains?function(a,b){var c=a.nodeType===9?a.documentElement:a,d=b.parentNode;return a===d||!!(d&&d.nodeType===1&&c.contains&&c.contains(d))}:function(a,b){while(b=b.parentNode)if(b===a)return!0;return!1},bc=Z.getText=function(a){var b,c="",d=0,e=a.nodeType;if(e){if(e===1||e===9||e===11){if(typeof a.textContent=="string")return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=bc(a)}else if(e===3||e===4)return a.nodeValue}else for(;b=a[d];d++)c+=bc(b);return c};Z.attr=function(a,b){var c,d=ba(a);return d||(b=b.toLowerCase()),$.attrHandle[b]?$.attrHandle[b](a):U||d?a.getAttribute(b):(c=a.getAttributeNode(b),c?typeof a[b]=="boolean"?a[b]?b:null:c.specified?c.value:null:null)},Z.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},[0,0].sort(function(){return l=0}),i.compareDocumentPosition?e=function(a,b){return a===b?(k=!0,0):(!a.compareDocumentPosition||!b.compareDocumentPosition?a.compareDocumentPosition:a.compareDocumentPosition(b)&4)?-1:1}:(e=function(a,b){if(a===b)return k=!0,0;if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],g=[],h=a.parentNode,i=b.parentNode,j=h;if(h===i)return f(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)g.unshift(j),j=j.parentNode;c=e.length,d=g.length;for(var l=0;l<c&&l<d;l++)if(e[l]!==g[l])return f(e[l],g[l]);return l===c?f(a,g[l],-1):f(e[l],b,1)},f=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),Z.uniqueSort=function(a){var b,c=1;if(e){k=l,a.sort(e);if(k)for(;b=a[c];c++)b===a[c-1]&&a.splice(c--,1)}return a};var bl=Z.compile=function(a,b,c){var d,e,f,g=O[a];if(g&&g.context===b)return g;e=bg(a,b,c);for(f=0;d=e[f];f++)e[f]=bj(d,b,c);return g=O[a]=bk(e),g.context=b,g.runs=g.dirruns=0,P.push(a),P.length>$.cacheLength&&delete O[P.shift()],g};Z.matches=function(a,b){return Z(a,null,null,b)},Z.matchesSelector=function(a,b){return Z(b,null,null,[a]).length>0};var bm=function(a,b,e,f,g){a=a.replace(A,"$1");var h,i,j,k,l,m,p,q,r,s=a.match(C),t=a.match(E),u=b.nodeType;if(L.POS.test(a))return bf(a,b,e,f,s);if(f)h=n.call(f,0);else if(s&&s.length===1){if(t.length>1&&u===9&&!g&&(s=L.ID.exec(t[0]))){b=$.find.ID(s[1],b,g)[0];if(!b)return e;a=a.slice(t.shift().length)}q=(s=G.exec(t[0]))&&!s.index&&b.parentNode||b,r=t.pop(),m=r.split(":not")[0];for(j=0,k=$.order.length;j<k;j++){p=$.order[j];if(s=L[p].exec(m)){h=$.find[p]((s[1]||"").replace(K,""),q,g);if(h==null)continue;m===r&&(a=a.slice(0,a.length-r.length)+m.replace(L[p],""),a||o.apply(e,n.call(h,0)));break}}}if(a){i=bl(a,b,g),d=i.dirruns++,h==null&&(h=$.find.TAG("*",G.test(a)&&b.parentNode||b));for(j=0;l=h[j];j++)c=i.runs++,i(l,b)&&e.push(l)}return e};h.querySelectorAll&&function(){var a,b=bm,c=/'|\\/g,d=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,e=[],f=[":active"],g=i.matchesSelector||i.mozMatchesSelector||i.webkitMatchesSelector||i.oMatchesSelector||i.msMatchesSelector;T(function(a){a.innerHTML="<select><option selected></option></select>",a.querySelectorAll("[selected]").length||e.push("\\["+r+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),a.querySelectorAll(":checked").length||e.push(":checked")}),T(function(a){a.innerHTML="<p test=''></p>",a.querySelectorAll("[test^='']").length&&e.push("[*^$]="+r+"*(?:\"\"|'')"),a.innerHTML="<input type='hidden'>",a.querySelectorAll(":enabled").length||e.push(":enabled",":disabled")}),e=e.length&&new RegExp(e.join("|")),bm=function(a,d,f,g,h){if(!g&&!h&&(!e||!e.test(a)))if(d.nodeType===9)try{return o.apply(f,n.call(d.querySelectorAll(a),0)),f}catch(i){}else if(d.nodeType===1&&d.nodeName.toLowerCase()!=="object"){var j=d.getAttribute("id"),k=j||q,l=G.test(a)&&d.parentNode||d;j?k=k.replace(c,"\\$&"):d.setAttribute("id",k);try{return o.apply(f,n.call(l.querySelectorAll(a.replace(C,"[id='"+k+"'] $&")),0)),f}catch(i){}finally{j||d.removeAttribute("id")}}return b(a,d,f,g,h)},g&&(T(function(b){a=g.call(b,"div");try{g.call(b,"[test!='']:sizzle"),f.push($.match.PSEUDO)}catch(c){}}),f=new RegExp(f.join("|")),Z.matchesSelector=function(b,c){c=c.replace(d,"='$1']");if(!ba(b)&&!f.test(c)&&(!e||!e.test(c)))try{var h=g.call(b,c);if(h||a||b.document&&b.document.nodeType!==11)return h}catch(i){}return Z(c,null,null,[b]).length>0})}(),Z.attr=p.attr,p.find=Z,p.expr=Z.selectors,p.expr[":"]=p.expr.pseudos,p.unique=Z.uniqueSort,p.text=Z.getText,p.isXMLDoc=Z.isXML,p.contains=Z.contains}(a);var bc=/Until$/,bd=/^(?:parents|prev(?:Until|All))/,be=/^.[^:#\[\.,]*$/,bf=p.expr.match.needsContext,bg={children:!0,contents:!0,next:!0,prev:!0};p.fn.extend({find:function(a){var b,c,d,e,f,g,h=this;if(typeof a!="string")return p(a).filter(function(){for(b=0,c=h.length;b<c;b++)if(p.contains(h[b],this))return!0});g=this.pushStack("","find",a);for(b=0,c=this.length;b<c;b++){d=g.length,p.find(a,this[b],g);if(b>0)for(e=d;e<g.length;e++)for(f=0;f<d;f++)if(g[f]===g[e]){g.splice(e--,1);break}}return g},has:function(a){var b,c=p(a,this),d=c.length;return this.filter(function(){for(b=0;b<d;b++)if(p.contains(this,c[b]))return!0})},not:function(a){return this.pushStack(bj(this,a,!1),"not",a)},filter:function(a){return this.pushStack(bj(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?bf.test(a)?p(a,this.context).index(this[0])>=0:p.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c,d=0,e=this.length,f=[],g=bf.test(a)||typeof a!="string"?p(a,b||this.context):0;for(;d<e;d++){c=this[d];while(c&&c.ownerDocument&&c!==b&&c.nodeType!==11){if(g?g.index(c)>-1:p.find.matchesSelector(c,a)){f.push(c);break}c=c.parentNode}}return f=f.length>1?p.unique(f):f,this.pushStack(f,"closest",a)},index:function(a){return a?typeof a=="string"?p.inArray(this[0],p(a)):p.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(a,b){var c=typeof a=="string"?p(a,b):p.makeArray(a&&a.nodeType?[a]:a),d=p.merge(this.get(),c);return this.pushStack(bh(c[0])||bh(d[0])?d:p.unique(d))},addBack:function(a){return this.add(a==null?this.prevObject:this.prevObject.filter(a))}}),p.fn.andSelf=p.fn.addBack,p.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return p.dir(a,"parentNode")},parentsUntil:function(a,b,c){return p.dir(a,"parentNode",c)},next:function(a){return bi(a,"nextSibling")},prev:function(a){return bi(a,"previousSibling")},nextAll:function(a){return p.dir(a,"nextSibling")},prevAll:function(a){return p.dir(a,"previousSibling")},nextUntil:function(a,b,c){return p.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return p.dir(a,"previousSibling",c)},siblings:function(a){return p.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return p.sibling(a.firstChild)},contents:function(a){return p.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:p.merge([],a.childNodes)}},function(a,b){p.fn[a]=function(c,d){var e=p.map(this,b,c);return bc.test(a)||(d=c),d&&typeof d=="string"&&(e=p.filter(d,e)),e=this.length>1&&!bg[a]?p.unique(e):e,this.length>1&&bd.test(a)&&(e=e.reverse()),this.pushStack(e,a,k.call(arguments).join(","))}}),p.extend({filter:function(a,b,c){return c&&(a=":not("+a+")"),b.length===1?p.find.matchesSelector(b[0],a)?[b[0]]:[]:p.find.matches(a,b)},dir:function(a,c,d){var e=[],f=a[c];while(f&&f.nodeType!==9&&(d===b||f.nodeType!==1||!p(f).is(d)))f.nodeType===1&&e.push(f),f=f[c];return e},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var bl="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",bm=/ jQuery\d+="(?:null|\d+)"/g,bn=/^\s+/,bo=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bp=/<([\w:]+)/,bq=/<tbody/i,br=/<|&#?\w+;/,bs=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,bu=new RegExp("<(?:"+bl+")[\\s/>]","i"),bv=/^(?:checkbox|radio)$/,bw=/checked\s*(?:[^=]|=\s*.checked.)/i,bx=/\/(java|ecma)script/i,by=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,bz={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bA=bk(e),bB=bA.appendChild(e.createElement("div"));bz.optgroup=bz.option,bz.tbody=bz.tfoot=bz.colgroup=bz.caption=bz.thead,bz.th=bz.td,p.support.htmlSerialize||(bz._default=[1,"X<div>","</div>"]),p.fn.extend({text:function(a){return p.access(this,function(a){return a===b?p.text(this):this.empty().append((this[0]&&this[0].ownerDocument||e).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(p.isFunction(a))return this.each(function(b){p(this).wrapAll(a.call(this,b))});if(this[0]){var b=p(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return p.isFunction(a)?this.each(function(b){p(this).wrapInner(a.call(this,b))}):this.each(function(){var b=p(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=p.isFunction(a);return this.each(function(c){p(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){p.nodeName(this,"body")||p(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){(this.nodeType===1||this.nodeType===11)&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(a,this.firstChild)})},before:function(){if(!bh(this[0]))return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=p.clean(arguments);return this.pushStack(p.merge(a,this),"before",this.selector)}},after:function(){if(!bh(this[0]))return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=p.clean(arguments);return this.pushStack(p.merge(this,a),"after",this.selector)}},remove:function(a,b){var c,d=0;for(;(c=this[d])!=null;d++)if(!a||p.filter(a,[c]).length)!b&&c.nodeType===1&&(p.cleanData(c.getElementsByTagName("*")),p.cleanData([c])),c.parentNode&&c.parentNode.removeChild(c);return this},empty:function(){var a,b=0;for(;(a=this[b])!=null;b++){a.nodeType===1&&p.cleanData(a.getElementsByTagName("*"));while(a.firstChild)a.removeChild(a.firstChild)}return this},clone:function(a,b){return a=a==null?!1:a,b=b==null?a:b,this.map(function(){return p.clone(this,a,b)})},html:function(a){return p.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(bm,""):b;if(typeof a=="string"&&!bs.test(a)&&(p.support.htmlSerialize||!bu.test(a))&&(p.support.leadingWhitespace||!bn.test(a))&&!bz[(bp.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(bo,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(p.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(f){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){return bh(this[0])?this.length?this.pushStack(p(p.isFunction(a)?a():a),"replaceWith",a):this:p.isFunction(a)?this.each(function(b){var c=p(this),d=c.html();c.replaceWith(a.call(this,b,d))}):(typeof a!="string"&&(a=p(a).detach()),this.each(function(){var b=this.nextSibling,c=this.parentNode;p(this).remove(),b?p(b).before(a):p(c).append(a)}))},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){a=[].concat.apply([],a);var e,f,g,h,i=0,j=a[0],k=[],l=this.length;if(!p.support.checkClone&&l>1&&typeof j=="string"&&bw.test(j))return this.each(function(){p(this).domManip(a,c,d)});if(p.isFunction(j))return this.each(function(e){var f=p(this);a[0]=j.call(this,e,c?f.html():b),f.domManip(a,c,d)});if(this[0]){e=p.buildFragment(a,this,k),g=e.fragment,f=g.firstChild,g.childNodes.length===1&&(g=f);if(f){c=c&&p.nodeName(f,"tr");for(h=e.cacheable||l-1;i<l;i++)d.call(c&&p.nodeName(this[i],"table")?bC(this[i],"tbody"):this[i],i===h?g:p.clone(g,!0,!0))}g=f=null,k.length&&p.each(k,function(a,b){b.src?p.ajax?p.ajax({url:b.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):p.error("no ajax"):p.globalEval((b.text||b.textContent||b.innerHTML||"").replace(by,"")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),p.buildFragment=function(a,c,d){var f,g,h,i=a[0];return c=c||e,c=(c[0]||c).ownerDocument||c[0]||c,typeof c.createDocumentFragment=="undefined"&&(c=e),a.length===1&&typeof i=="string"&&i.length<512&&c===e&&i.charAt(0)==="<"&&!bt.test(i)&&(p.support.checkClone||!bw.test(i))&&(p.support.html5Clone||!bu.test(i))&&(g=!0,f=p.fragments[i],h=f!==b),f||(f=c.createDocumentFragment(),p.clean(a,c,f,d),g&&(p.fragments[i]=h&&f)),{fragment:f,cacheable:g}},p.fragments={},p.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){p.fn[a]=function(c){var d,e=0,f=[],g=p(c),h=g.length,i=this.length===1&&this[0].parentNode;if((i==null||i&&i.nodeType===11&&i.childNodes.length===1)&&h===1)return g[b](this[0]),this;for(;e<h;e++)d=(e>0?this.clone(!0):this).get(),p(g[e])[b](d),f=f.concat(d);return this.pushStack(f,a,g.selector)}}),p.extend({clone:function(a,b,c){var d,e,f,g;p.support.html5Clone||p.isXMLDoc(a)||!bu.test("<"+a.nodeName+">")?g=a.cloneNode(!0):(bB.innerHTML=a.outerHTML,bB.removeChild(g=bB.firstChild));if((!p.support.noCloneEvent||!p.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!p.isXMLDoc(a)){bE(a,g),d=bF(a),e=bF(g);for(f=0;d[f];++f)e[f]&&bE(d[f],e[f])}if(b){bD(a,g);if(c){d=bF(a),e=bF(g);for(f=0;d[f];++f)bD(d[f],e[f])}}return d=e=null,g},clean:function(a,b,c,d){var f,g,h,i,j,k,l,m,n,o,q,r,s=0,t=[];if(!b||typeof b.createDocumentFragment=="undefined")b=e;for(g=b===e&&bA;(h=a[s])!=null;s++){typeof h=="number"&&(h+="");if(!h)continue;if(typeof h=="string")if(!br.test(h))h=b.createTextNode(h);else{g=g||bk(b),l=l||g.appendChild(b.createElement("div")),h=h.replace(bo,"<$1></$2>"),i=(bp.exec(h)||["",""])[1].toLowerCase(),j=bz[i]||bz._default,k=j[0],l.innerHTML=j[1]+h+j[2];while(k--)l=l.lastChild;if(!p.support.tbody){m=bq.test(h),n=i==="table"&&!m?l.firstChild&&l.firstChild.childNodes:j[1]==="<table>"&&!m?l.childNodes:[];for(f=n.length-1;f>=0;--f)p.nodeName(n[f],"tbody")&&!n[f].childNodes.length&&n[f].parentNode.removeChild(n[f])}!p.support.leadingWhitespace&&bn.test(h)&&l.insertBefore(b.createTextNode(bn.exec(h)[0]),l.firstChild),h=l.childNodes,l=g.lastChild}h.nodeType?t.push(h):t=p.merge(t,h)}l&&(g.removeChild(l),h=l=g=null);if(!p.support.appendChecked)for(s=0;(h=t[s])!=null;s++)p.nodeName(h,"input")?bG(h):typeof h.getElementsByTagName!="undefined"&&p.grep(h.getElementsByTagName("input"),bG);if(c){q=function(a){if(!a.type||bx.test(a.type))return d?d.push(a.parentNode?a.parentNode.removeChild(a):a):c.appendChild(a)};for(s=0;(h=t[s])!=null;s++)if(!p.nodeName(h,"script")||!q(h))c.appendChild(h),typeof h.getElementsByTagName!="undefined"&&(r=p.grep(p.merge([],h.getElementsByTagName("script")),q),t.splice.apply(t,[s+1,0].concat(r)),s+=r.length)}return t},cleanData:function(a,b){var c,d,e,f,g=0,h=p.expando,i=p.cache,j=p.support.deleteExpando,k=p.event.special;for(;(e=a[g])!=null;g++)if(b||p.acceptData(e)){d=e[h],c=d&&i[d];if(c){if(c.events)for(f in c.events)k[f]?p.event.remove(e,f):p.removeEvent(e,f,c.handle);i[d]&&(delete i[d],j?delete e[h]:e.removeAttribute?e.removeAttribute(h):e[h]=null,p.deletedIds.push(d))}}}}),function(){var a,b;p.uaMatch=function(a){a=a.toLowerCase();var b=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},a=p.uaMatch(g.userAgent),b={},a.browser&&(b[a.browser]=!0,b.version=a.version),b.webkit&&(b.safari=!0),p.browser=b,p.sub=function(){function a(b,c){return new a.fn.init(b,c)}p.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function c(c,d){return d&&d instanceof p&&!(d instanceof a)&&(d=a(d)),p.fn.init.call(this,c,d,b)},a.fn.init.prototype=a.fn;var b=a(e);return a}}();var bH,bI,bJ,bK=/alpha\([^)]*\)/i,bL=/opacity=([^)]*)/,bM=/^(top|right|bottom|left)$/,bN=/^margin/,bO=new RegExp("^("+q+")(.*)$","i"),bP=new RegExp("^("+q+")(?!px)[a-z%]+$","i"),bQ=new RegExp("^([-+])=("+q+")","i"),bR={},bS={position:"absolute",visibility:"hidden",display:"block"},bT={letterSpacing:0,fontWeight:400,lineHeight:1},bU=["Top","Right","Bottom","Left"],bV=["Webkit","O","Moz","ms"],bW=p.fn.toggle;p.fn.extend({css:function(a,c){return p.access(this,function(a,c,d){return d!==b?p.style(a,c,d):p.css(a,c)},a,c,arguments.length>1)},show:function(){return bZ(this,!0)},hide:function(){return bZ(this)},toggle:function(a,b){var c=typeof a=="boolean";return p.isFunction(a)&&p.isFunction(b)?bW.apply(this,arguments):this.each(function(){(c?a:bY(this))?p(this).show():p(this).hide()})}}),p.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bH(a,"opacity");return c===""?"1":c}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":p.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!a||a.nodeType===3||a.nodeType===8||!a.style)return;var f,g,h,i=p.camelCase(c),j=a.style;c=p.cssProps[i]||(p.cssProps[i]=bX(j,i)),h=p.cssHooks[c]||p.cssHooks[i];if(d===b)return h&&"get"in h&&(f=h.get(a,!1,e))!==b?f:j[c];g=typeof d,g==="string"&&(f=bQ.exec(d))&&(d=(f[1]+1)*f[2]+parseFloat(p.css(a,c)),g="number");if(d==null||g==="number"&&isNaN(d))return;g==="number"&&!p.cssNumber[i]&&(d+="px");if(!h||!("set"in h)||(d=h.set(a,d,e))!==b)try{j[c]=d}catch(k){}},css:function(a,c,d,e){var f,g,h,i=p.camelCase(c);return c=p.cssProps[i]||(p.cssProps[i]=bX(a.style,i)),h=p.cssHooks[c]||p.cssHooks[i],h&&"get"in h&&(f=h.get(a,!0,e)),f===b&&(f=bH(a,c)),f==="normal"&&c in bT&&(f=bT[c]),d||e!==b?(g=parseFloat(f),d||p.isNumeric(g)?g||0:f):f},swap:function(a,b,c){var d,e,f={};for(e in b)f[e]=a.style[e],a.style[e]=b[e];d=c.call(a);for(e in b)a.style[e]=f[e];return d}}),a.getComputedStyle?bH=function(a,b){var c,d,e,f,g=getComputedStyle(a,null),h=a.style;return g&&(c=g[b],c===""&&!p.contains(a.ownerDocument.documentElement,a)&&(c=p.style(a,b)),bP.test(c)&&bN.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=c,c=g.width,h.width=d,h.minWidth=e,h.maxWidth=f)),c}:e.documentElement.currentStyle&&(bH=function(a,b){var c,d,e=a.currentStyle&&a.currentStyle[b],f=a.style;return e==null&&f&&f[b]&&(e=f[b]),bP.test(e)&&!bM.test(b)&&(c=f.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":e,e=f.pixelLeft+"px",f.left=c,d&&(a.runtimeStyle.left=d)),e===""?"auto":e}),p.each(["height","width"],function(a,b){p.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0||bH(a,"display")!=="none"?ca(a,b,d):p.swap(a,bS,function(){return ca(a,b,d)})},set:function(a,c,d){return b$(a,c,d?b_(a,b,d,p.support.boxSizing&&p.css(a,"boxSizing")==="border-box"):0)}}}),p.support.opacity||(p.cssHooks.opacity={get:function(a,b){return bL.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=p.isNumeric(b)?"alpha(opacity="+b*100+")":"",f=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&p.trim(f.replace(bK,""))===""&&c.removeAttribute){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bK.test(f)?f.replace(bK,e):f+" "+e}}),p(function(){p.support.reliableMarginRight||(p.cssHooks.marginRight={get:function(a,b){return p.swap(a,{display:"inline-block"},function(){if(b)return bH(a,"marginRight")})}}),!p.support.pixelPosition&&p.fn.position&&p.each(["top","left"],function(a,b){p.cssHooks[b]={get:function(a,c){if(c){var d=bH(a,b);return bP.test(d)?p(a).position()[b]+"px":d}}}})}),p.expr&&p.expr.filters&&(p.expr.filters.hidden=function(a){return a.offsetWidth===0&&a.offsetHeight===0||!p.support.reliableHiddenOffsets&&(a.style&&a.style.display||bH(a,"display"))==="none"},p.expr.filters.visible=function(a){return!p.expr.filters.hidden(a)}),p.each({margin:"",padding:"",border:"Width"},function(a,b){p.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bU[d]+b]=e[d]||e[d-2]||e[0];return f}},bN.test(a)||(p.cssHooks[a+b].set=b$)});var cc=/%20/g,cd=/\[\]$/,ce=/\r?\n/g,cf=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,cg=/^(?:select|textarea)/i;p.fn.extend({serialize:function(){return p.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?p.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||cg.test(this.nodeName)||cf.test(this.type))}).map(function(a,b){var c=p(this).val();return c==null?null:p.isArray(c)?p.map(c,function(a,c){return{name:b.name,value:a.replace(ce,"\r\n")}}):{name:b.name,value:c.replace(ce,"\r\n")}}).get()}}),p.param=function(a,c){var d,e=[],f=function(a,b){b=p.isFunction(b)?b():b==null?"":b,e[e.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=p.ajaxSettings&&p.ajaxSettings.traditional);if(p.isArray(a)||a.jquery&&!p.isPlainObject(a))p.each(a,function(){f(this.name,this.value)});else for(d in a)ch(d,a[d],c,f);return e.join("&").replace(cc,"+")};var ci,cj,ck=/#.*$/,cl=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,cm=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,cn=/^(?:GET|HEAD)$/,co=/^\/\//,cp=/\?/,cq=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,cr=/([?&])_=[^&]*/,cs=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,ct=p.fn.load,cu={},cv={},cw=["*/"]+["*"];try{ci=f.href}catch(cx){ci=e.createElement("a"),ci.href="",ci=ci.href}cj=cs.exec(ci.toLowerCase())||[],p.fn.load=function(a,c,d){if(typeof a!="string"&&ct)return ct.apply(this,arguments);if(!this.length)return this;var e,f,g,h=this,i=a.indexOf(" ");return i>=0&&(e=a.slice(i,a.length),a=a.slice(0,i)),p.isFunction(c)?(d=c,c=b):typeof c=="object"&&(f="POST"),p.ajax({url:a,type:f,dataType:"html",data:c,complete:function(a,b){d&&h.each(d,g||[a.responseText,b,a])}}).done(function(a){g=arguments,h.html(e?p("<div>").append(a.replace(cq,"")).find(e):a)}),this},p.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){p.fn[b]=function(a){return this.on(b,a)}}),p.each(["get","post"],function(a,c){p[c]=function(a,d,e,f){return p.isFunction(d)&&(f=f||e,e=d,d=b),p.ajax({type:c,url:a,data:d,success:e,dataType:f})}}),p.extend({getScript:function(a,c){return p.get(a,b,c,"script")},getJSON:function(a,b,c){return p.get(a,b,c,"json")},ajaxSetup:function(a,b){return b?cA(a,p.ajaxSettings):(b=a,a=p.ajaxSettings),cA(a,b),a},ajaxSettings:{url:ci,isLocal:cm.test(cj[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":cw},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":p.parseJSON,"text xml":p.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:cy(cu),ajaxTransport:cy(cv),ajax:function(a,c){function y(a,c,f,i){var k,s,t,u,w,y=c;if(v===2)return;v=2,h&&clearTimeout(h),g=b,e=i||"",x.readyState=a>0?4:0,f&&(u=cB(l,x,f));if(a>=200&&a<300||a===304)l.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(p.lastModified[d]=w),w=x.getResponseHeader("Etag"),w&&(p.etag[d]=w)),a===304?(y="notmodified",k=!0):(k=cC(l,u),y=k.state,s=k.data,t=k.error,k=!t);else{t=y;if(!y||a)y="error",a<0&&(a=0)}x.status=a,x.statusText=""+(c||y),k?o.resolveWith(m,[s,y,x]):o.rejectWith(m,[x,y,t]),x.statusCode(r),r=b,j&&n.trigger("ajax"+(k?"Success":"Error"),[x,l,k?s:t]),q.fireWith(m,[x,y]),j&&(n.trigger("ajaxComplete",[x,l]),--p.active||p.event.trigger("ajaxStop"))}typeof a=="object"&&(c=a,a=b),c=c||{};var d,e,f,g,h,i,j,k,l=p.ajaxSetup({},c),m=l.context||l,n=m!==l&&(m.nodeType||m instanceof p)?p(m):p.event,o=p.Deferred(),q=p.Callbacks("once memory"),r=l.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,setRequestHeader:function(a,b){if(!v){var c=a.toLowerCase();a=u[c]=u[c]||a,t[a]=b}return this},getAllResponseHeaders:function(){return v===2?e:null},getResponseHeader:function(a){var c;if(v===2){if(!f){f={};while(c=cl.exec(e))f[c[1].toLowerCase()]=c[2]}c=f[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){return v||(l.mimeType=a),this},abort:function(a){return a=a||w,g&&g.abort(a),y(0,a),this}};o.promise(x),x.success=x.done,x.error=x.fail,x.complete=q.add,x.statusCode=function(a){if(a){var b;if(v<2)for(b in a)r[b]=[r[b],a[b]];else b=a[x.status],x.always(b)}return this},l.url=((a||l.url)+"").replace(ck,"").replace(co,cj[1]+"//"),l.dataTypes=p.trim(l.dataType||"*").toLowerCase().split(s),l.crossDomain==null&&(i=cs.exec(l.url.toLowerCase()),l.crossDomain=!(!i||i[1]==cj[1]&&i[2]==cj[2]&&(i[3]||(i[1]==="http:"?80:443))==(cj[3]||(cj[1]==="http:"?80:443)))),l.data&&l.processData&&typeof l.data!="string"&&(l.data=p.param(l.data,l.traditional)),cz(cu,l,c,x);if(v===2)return x;j=l.global,l.type=l.type.toUpperCase(),l.hasContent=!cn.test(l.type),j&&p.active++===0&&p.event.trigger("ajaxStart");if(!l.hasContent){l.data&&(l.url+=(cp.test(l.url)?"&":"?")+l.data,delete l.data),d=l.url;if(l.cache===!1){var z=p.now(),A=l.url.replace(cr,"$1_="+z);l.url=A+(A===l.url?(cp.test(l.url)?"&":"?")+"_="+z:"")}}(l.data&&l.hasContent&&l.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",l.contentType),l.ifModified&&(d=d||l.url,p.lastModified[d]&&x.setRequestHeader("If-Modified-Since",p.lastModified[d]),p.etag[d]&&x.setRequestHeader("If-None-Match",p.etag[d])),x.setRequestHeader("Accept",l.dataTypes[0]&&l.accepts[l.dataTypes[0]]?l.accepts[l.dataTypes[0]]+(l.dataTypes[0]!=="*"?", "+cw+"; q=0.01":""):l.accepts["*"]);for(k in l.headers)x.setRequestHeader(k,l.headers[k]);if(!l.beforeSend||l.beforeSend.call(m,x,l)!==!1&&v!==2){w="abort";for(k in{success:1,error:1,complete:1})x[k](l[k]);g=cz(cv,l,c,x);if(!g)y(-1,"No Transport");else{x.readyState=1,j&&n.trigger("ajaxSend",[x,l]),l.async&&l.timeout>0&&(h=setTimeout(function(){x.abort("timeout")},l.timeout));try{v=1,g.send(t,y)}catch(B){if(v<2)y(-1,B);else throw B}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var cD=[],cE=/\?/,cF=/(=)\?(?=&|$)|\?\?/,cG=p.now();p.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=cD.pop()||p.expando+"_"+cG++;return this[a]=!0,a}}),p.ajaxPrefilter("json jsonp",function(c,d,e){var f,g,h,i=c.data,j=c.url,k=c.jsonp!==!1,l=k&&cF.test(j),m=k&&!l&&typeof i=="string"&&!(c.contentType||"").indexOf("application/x-www-form-urlencoded")&&cF.test(i);if(c.dataTypes[0]==="jsonp"||l||m)return f=c.jsonpCallback=p.isFunction(c.jsonpCallback)?c.jsonpCallback():c.jsonpCallback,g=a[f],l?c.url=j.replace(cF,"$1"+f):m?c.data=i.replace(cF,"$1"+f):k&&(c.url+=(cE.test(j)?"&":"?")+c.jsonp+"="+f),c.converters["script json"]=function(){return h||p.error(f+" was not called"),h[0]},c.dataTypes[0]="json",a[f]=function(){h=arguments},e.always(function(){a[f]=g,c[f]&&(c.jsonpCallback=d.jsonpCallback,cD.push(f)),h&&p.isFunction(g)&&g(h[0]),h=g=b}),"script"}),p.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){return p.globalEval(a),a}}}),p.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),p.ajaxTransport("script",function(a){if(a.crossDomain){var c,d=e.head||e.getElementsByTagName("head")[0]||e.documentElement;return{send:function(f,g){c=e.createElement("script"),c.async="async",a.scriptCharset&&(c.charset=a.scriptCharset),c.src=a.url,c.onload=c.onreadystatechange=function(a,e){if(e||!c.readyState||/loaded|complete/.test(c.readyState))c.onload=c.onreadystatechange=null,d&&c.parentNode&&d.removeChild(c),c=b,e||g(200,"success")},d.insertBefore(c,d.firstChild)},abort:function(){c&&c.onload(0,1)}}}});var cH,cI=a.ActiveXObject?function(){for(var a in cH)cH[a](0,1)}:!1,cJ=0;p.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&cK()||cL()}:cK,function(a){p.extend(p.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(p.ajaxSettings.xhr()),p.support.ajax&&p.ajaxTransport(function(c){if(!c.crossDomain||p.support.cors){var d;return{send:function(e,f){var g,h,i=c.xhr();c.username?i.open(c.type,c.url,c.async,c.username,c.password):i.open(c.type,c.url,c.async);if(c.xhrFields)for(h in c.xhrFields)i[h]=c.xhrFields[h];c.mimeType&&i.overrideMimeType&&i.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(h in e)i.setRequestHeader(h,e[h])}catch(j){}i.send(c.hasContent&&c.data||null),d=function(a,e){var h,j,k,l,m;try{if(d&&(e||i.readyState===4)){d=b,g&&(i.onreadystatechange=p.noop,cI&&delete cH[g]);if(e)i.readyState!==4&&i.abort();else{h=i.status,k=i.getAllResponseHeaders(),l={},m=i.responseXML,m&&m.documentElement&&(l.xml=m);try{l.text=i.responseText}catch(a){}try{j=i.statusText}catch(n){j=""}!h&&c.isLocal&&!c.crossDomain?h=l.text?200:404:h===1223&&(h=204)}}}catch(o){e||f(-1,o)}l&&f(h,j,l,k)},c.async?i.readyState===4?setTimeout(d,0):(g=++cJ,cI&&(cH||(cH={},p(a).unload(cI)),cH[g]=d),i.onreadystatechange=d):d()},abort:function(){d&&d(0,1)}}}});var cM,cN,cO=/^(?:toggle|show|hide)$/,cP=new RegExp("^(?:([-+])=|)("+q+")([a-z%]*)$","i"),cQ=/queueHooks$/,cR=[cX],cS={"*":[function(a,b){var c,d,e,f=this.createTween(a,b),g=cP.exec(b),h=f.cur(),i=+h||0,j=1;if(g){c=+g[2],d=g[3]||(p.cssNumber[a]?"":"px");if(d!=="px"&&i){i=p.css(f.elem,a,!0)||c||1;do e=j=j||".5",i=i/j,p.style(f.elem,a,i+d),j=f.cur()/h;while(j!==1&&j!==e)}f.unit=d,f.start=i,f.end=g[1]?i+(g[1]+1)*c:c}return f}]};p.Animation=p.extend(cV,{tweener:function(a,b){p.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");var c,d=0,e=a.length;for(;d<e;d++)c=a[d],cS[c]=cS[c]||[],cS[c].unshift(b)},prefilter:function(a,b){b?cR.unshift(a):cR.push(a)}}),p.Tween=cY,cY.prototype={constructor:cY,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(p.cssNumber[c]?"":"px")},cur:function(){var a=cY.propHooks[this.prop];return a&&a.get?a.get(this):cY.propHooks._default.get(this)},run:function(a){var b,c=cY.propHooks[this.prop];return this.pos=b=p.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration),this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):cY.propHooks._default.set(this),this}},cY.prototype.init.prototype=cY.prototype,cY.propHooks={_default:{get:function(a){var b;return a.elem[a.prop]==null||!!a.elem.style&&a.elem.style[a.prop]!=null?(b=p.css(a.elem,a.prop,!1,""),!b||b==="auto"?0:b):a.elem[a.prop]},set:function(a){p.fx.step[a.prop]?p.fx.step[a.prop](a):a.elem.style&&(a.elem.style[p.cssProps[a.prop]]!=null||p.cssHooks[a.prop])?p.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},cY.propHooks.scrollTop=cY.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},p.each(["toggle","show","hide"],function(a,b){var c=p.fn[b];p.fn[b]=function(d,e,f){return d==null||typeof d=="boolean"||!a&&p.isFunction(d)&&p.isFunction(e)?c.apply(this,arguments):this.animate(cZ(b,!0),d,e,f)}}),p.fn.extend({fadeTo:function(a,b,c,d){return this.filter(bY).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=p.isEmptyObject(a),f=p.speed(b,c,d),g=function(){var b=cV(this,p.extend({},a),f);e&&b.stop(!0)};return e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,c,d){var e=function(a){var b=a.stop;delete a.stop,b(d)};return typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,c=a!=null&&a+"queueHooks",f=p.timers,g=p._data(this);if(c)g[c]&&g[c].stop&&e(g[c]);else for(c in g)g[c]&&g[c].stop&&cQ.test(c)&&e(g[c]);for(c=f.length;c--;)f[c].elem===this&&(a==null||f[c].queue===a)&&(f[c].anim.stop(d),b=!1,f.splice(c,1));(b||!d)&&p.dequeue(this,a)})}}),p.each({slideDown:cZ("show"),slideUp:cZ("hide"),slideToggle:cZ("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){p.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),p.speed=function(a,b,c){var d=a&&typeof a=="object"?p.extend({},a):{complete:c||!c&&b||p.isFunction(a)&&a,duration:a,easing:c&&b||b&&!p.isFunction(b)&&b};d.duration=p.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in p.fx.speeds?p.fx.speeds[d.duration]:p.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";return d.old=d.complete,d.complete=function(){p.isFunction(d.old)&&d.old.call(this),d.queue&&p.dequeue(this,d.queue)},d},p.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},p.timers=[],p.fx=cY.prototype.init,p.fx.tick=function(){var a,b=p.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||p.fx.stop()},p.fx.timer=function(a){a()&&p.timers.push(a)&&!cN&&(cN=setInterval(p.fx.tick,p.fx.interval))},p.fx.interval=13,p.fx.stop=function(){clearInterval(cN),cN=null},p.fx.speeds={slow:600,fast:200,_default:400},p.fx.step={},p.expr&&p.expr.filters&&(p.expr.filters.animated=function(a){return p.grep(p.timers,function(b){return a===b.elem}).length});var c$=/^(?:body|html)$/i;p.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){p.offset.setOffset(this,a,b)});var c,d,e,f,g,h,i,j,k,l,m=this[0],n=m&&m.ownerDocument;if(!n)return;return(e=n.body)===m?p.offset.bodyOffset(m):(d=n.documentElement,p.contains(d,m)?(c=m.getBoundingClientRect(),f=c_(n),g=d.clientTop||e.clientTop||0,h=d.clientLeft||e.clientLeft||0,i=f.pageYOffset||d.scrollTop,j=f.pageXOffset||d.scrollLeft,k=c.top+i-g,l=c.left+j-h,{top:k,left:l}):{top:0,left:0})},p.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;return p.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(p.css(a,"marginTop"))||0,c+=parseFloat(p.css(a,"marginLeft"))||0),{top:b,left:c}},setOffset:function(a,b,c){var d=p.css(a,"position");d==="static"&&(a.style.position="relative");var e=p(a),f=e.offset(),g=p.css(a,"top"),h=p.css(a,"left"),i=(d==="absolute"||d==="fixed")&&p.inArray("auto",[g,h])>-1,j={},k={},l,m;i?(k=e.position(),l=k.top,m=k.left):(l=parseFloat(g)||0,m=parseFloat(h)||0),p.isFunction(b)&&(b=b.call(a,c,f)),b.top!=null&&(j.top=b.top-f.top+l),b.left!=null&&(j.left=b.left-f.left+m),"using"in b?b.using.call(a,j):e.css(j)}},p.fn.extend({position:function(){if(!this[0])return;var a=this[0],b=this.offsetParent(),c=this.offset(),d=c$.test(b[0].nodeName)?{top:0,left:0}:b.offset();return c.top-=parseFloat(p.css(a,"marginTop"))||0,c.left-=parseFloat(p.css(a,"marginLeft"))||0,d.top+=parseFloat(p.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(p.css(b[0],"borderLeftWidth"))||0,{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||e.body;while(a&&!c$.test(a.nodeName)&&p.css(a,"position")==="static")a=a.offsetParent;return a||e.body})}}),p.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);p.fn[a]=function(e){return p.access(this,function(a,e,f){var g=c_(a);if(f===b)return g?c in g?g[c]:g.document.documentElement[e]:a[e];g?g.scrollTo(d?p(g).scrollLeft():f,d?f:p(g).scrollTop()):a[e]=f},a,e,arguments.length,null)}}),p.each({Height:"height",Width:"width"},function(a,c){p.each({padding:"inner"+a,content:c,"":"outer"+a},function(d,e){p.fn[e]=function(e,f){var g=arguments.length&&(d||typeof e!="boolean"),h=d||(e===!0||f===!0?"margin":"border");return p.access(this,function(c,d,e){var f;return p.isWindow(c)?c.document.documentElement["client"+a]:c.nodeType===9?(f=c.documentElement,Math.max(c.body["scroll"+a],f["scroll"+a],c.body["offset"+a],f["offset"+a],f["client"+a])):e===b?p.css(c,d,e,h):p.style(c,d,e,h)},c,g?e:b,g)}})}),a.jQuery=a.$=p,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return p})})(window);
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright В© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright В© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
;
// jquery.royalslider v9.2.0
(function(k){function t(b,e){var c=navigator.userAgent.toLowerCase(),g=k.browser,a=this,f=g.webkit;c.indexOf("android");a.isIPAD=c.match(/(ipad)/);for(var d=document.createElement("div").style,i=["webkit","Moz","ms","O"],h="",j=0,m,c=0;c<i.length;c++)m=i[c],!h&&m+"Transform"in d&&(h=m),m=m.toLowerCase(),window.requestAnimationFrame||(window.requestAnimationFrame=window[m+"RequestAnimationFrame"],window.cancelAnimationFrame=window[m+"CancelAnimationFrame"]||window[m+"CancelRequestAnimationFrame"]);
window.requestAnimationFrame||(window.requestAnimationFrame=function(a){var b=(new Date).getTime(),c=Math.max(0,16-(b-j)),d=window.setTimeout(function(){a(b+c)},c);j=b+c;return d});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});a.slider=k(b);a.ev=k({});a._a=k(document);a.st=k.extend({},k.fn.royalSlider.defaults,e);a._b=a.st.transitionSpeed;if(a.st.allowCSS3&&(!f||a.st.allowCSS3OnWebkit))c=h+(h?"T":"t"),a._c=c+"ransform"in d&&c+"ransition"in d,a._c&&(a._d=h+
(h?"P":"p")+"erspective"in d);h=h.toLowerCase();a._e="-"+h+"-";a._f="vertical"===a.st.slidesOrientation?!1:!0;a._g=a._f?"left":"top";a._h=a._f?"width":"height";a._i=-1;a._j="fade"===a.st.transitionType?!1:!0;a._j||(a.st.sliderDrag=!1,a._k=10);a._l=0;a._m=0;k.each(k.rsModules,function(b,c){c.call(a)});a.slides=[];a._n=0;(a.st.slides?k(a.st.slides):a.slider.children().detach()).each(function(){a._o(this,true)});a.st.randomizeSlides&&a.slides.sort(function(){return 0.5-Math.random()});a.numSlides=a.slides.length;
a._p();a.st.startSlideId>a.numSlides-1&&(a.st.startSlideId=a.numSlides-1);a.staticSlideId=a.currSlideId=a._q=a.st.startSlideId;a.currSlide=a.slides[a.currSlideId];a._r=0;a.slider.addClass((a._f?"rsHor":"rsVer")+(a._j?"":" rsFade"));d='<div class="rsOverflow"><div class="rsContainer">';a.slidesSpacing=a.st.slidesSpacing;a._s=(a._f?a.slider.width():a.slider.height())+a.st.slidesSpacing;a._t=Boolean(0<a._u);1>=a.numSlides&&(a._v=!1);a._w=a._v&&a._j?2===a.numSlides?1:2:0;a._x=6>a.numSlides?a.numSlides:
6;a._y=0;a._z=0;a.slidesJQ=[];for(c=0;c<a.numSlides;c++)a.slidesJQ.push(k('<div style="'+(a._j?"":c!==a.currSlideId?"z-index: 0; display:none; opacity: 0; position: absolute;  left: 0; top: 0;":"z-index: 0;  position: absolute; left: 0; top: 0;")+'" class="rsSlide "></div>'));a.slider.html(d+"</div></div>");a._a1=a.slider.children(".rsOverflow");a._b1=a._a1.children(".rsContainer");a._c1=k('<div class="rsPreloader"></div>');c=a._b1.children(".rsSlide");a._d1=a.slidesJQ[a.currSlideId];a._e1=0;"ontouchstart"in
window||"createTouch"in document?(a.hasTouch=!0,a._f1="touchstart.rs",a._g1="touchmove.rs",a._h1="touchend.rs",a._i1="touchcancel.rs",a._j1=0.5):(a.hasTouch=!1,a._j1=0.2,a.st.sliderDrag&&(g.msie||g.opera?a._k1=a._l1="move":g.mozilla?(a._k1="-moz-grab",a._l1="-moz-grabbing"):f&&-1!=navigator.platform.indexOf("Mac")&&(a._k1="-webkit-grab",a._l1="-webkit-grabbing"),a._m1()),a._f1="mousedown.rs",a._g1="mousemove.rs",a._h1="mouseup.rs",a._i1="mouseup.rs");a._c?(a._n1="transition-property",a._o1="transition-duration",
a._p1="transition-timing-function",a._q1=a._r1=a._e+"transform",a._d?(f&&a.slider.addClass("rsWebkit3d"),a._s1="translate3d(",a._t1="px, ",a._u1="px, 0px)"):(a._s1="translate(",a._t1="px, ",a._u1="px)"),a._j)?a._b1[a._e+a._n1]=a._e+"transform":(g={},g[a._e+a._n1]="opacity",g[a._e+a._o1]=a.st.transitionSpeed+"ms",g[a._e+a._p1]=a.st.css3easeInOut,c.css(g)):(a._r1="left",a._q1="top");var l;k(window).on("resize.rs",function(){l&&clearTimeout(l);l=setTimeout(function(){a.updateSliderSize()},50)});a.ev.trigger("rsAfterPropsSetup");
a.updateSliderSize();a.st.keyboardNavEnabled&&a._v1();a.st.arrowsNavHideOnTouch&&a.hasTouch&&(a.st.arrowsNav=!1);a.st.arrowsNav&&(g=a.st.controlsInside?a._a1:a.slider,k('<div class="rsArrow rsArrowLeft"><div class="rsArrowIcn"></div></div><div class="rsArrow rsArrowRight"><div class="rsArrowIcn"></div></div>').appendTo(g),a._w1=g.children(".rsArrowLeft").click(function(b){b.preventDefault();a.prev()}),a._x1=g.children(".rsArrowRight").click(function(b){b.preventDefault();a.next()}),a.st.arrowsNavAutoHide&&
!a.hasTouch&&(a._w1.addClass("rsHidden"),a._x1.addClass("rsHidden"),g.one("mousemove.arrowshover",function(){a._w1.removeClass("rsHidden");a._x1.removeClass("rsHidden")}),g.hover(function(){if(!a._y1){a._w1.removeClass("rsHidden");a._x1.removeClass("rsHidden")}},function(){if(!a._y1){a._w1.addClass("rsHidden");a._x1.addClass("rsHidden")}})),a.ev.on("rsOnUpdateNav",function(){a._z1()}),a._z1());a._a2=!a.hasTouch&&a.st.sliderDrag||a.hasTouch&&a.st.sliderTouch;if(a._a2)a._b1.on(a._f1,function(b){a._b2(b)});
else a.dragSuccess=!1;var q=["rsPlayBtnIcon","rsPlayBtn","rsCloseVideoBtn","rsCloseVideoIcn"];a._b1.click(function(b){if(!a.dragSuccess){var c=k(b.target).attr("class");if(k.inArray(c,q)!==-1&&a.toggleVideo())return false;if(a.st.navigateByClick&&!a._c2){if(k(b.target).closest(".rsNoDrag",a._d1).length)return true;a._d2(b)}}});a.ev.trigger("rsAfterInit")}k.rsModules||(k.rsModules={});t.prototype={_d2:function(b){b[this._f?"pageX":"pageY"]-this._e2>0?this.next():this.prev()},_p:function(){var b;b=
this.st.numImagesToPreload;if(this._v=this.st.loop)if(this.numSlides===2){this._v=false;this.st.loopRewind=true}else if(this.numSlides<2)this.st.loopRewind=this._v=false;this._v&&b>0&&(this.numSlides<=4?b=1:this.st.numImagesToPreload>(this.numSlides-1)/2&&(b=Math.floor((this.numSlides-1)/2)));this._u=b},_o:function(b,e){function c(b,c){a.image=b.attr(!c?"src":c);a.caption=!c?b.attr("alt"):b.contents();a.videoURL=b.attr("data-rsVideo")}var g,a={};this._f2=b=k(b);this.ev.trigger("rsBeforeParseNode",
[b,a]);if(!a.stopParsing){b=this._f2;a.id=this._n;a.contentAdded=false;this._n++;if(!a.hasCover){if(b.hasClass("rsImg")){tempEl=b;g=true}else{tempEl=b.find(".rsImg");tempEl.length&&(g=true)}if(g){a.bigImage=tempEl.attr("data-rsBigImg");tempEl.is("a")?c(tempEl,"href"):tempEl.is("img")&&c(tempEl)}else if(b.is("img")){b.addClass("rsImg");c(b)}}tempEl=b.find(".rsCaption");if(tempEl.length)a.caption=tempEl.remove();if(!a.image){a.isLoaded=true;a.isRendered=false;a.isLoading=false}a.content=b;this.ev.trigger("rsAfterParseNode",
[b,a]);e&&this.slides.push(a);return a}},_v1:function(){var b=this;b._a.on("keydown.rskb",function(e){if(!b._g2&&!b._h2)if(e.keyCode===37){e.preventDefault();b.prev()}else if(e.keyCode===39){e.preventDefault();b.next()}})},goTo:function(b,e){b!==this.currSlideId&&this._i2(b,this.st.transitionSpeed,true,!e)},destroy:function(b){var e=this;e.ev.trigger("rsBeforeDestroy");e._a.off("keydown.rskb "+e._g1+" "+e._h1);e._b1.on(e._f1,function(b){e._b2(b)});e.slider.data("royalSlider","");b&&e.slider.remove()},
_j2:function(b,e){function c(c,e,f){if(c.isAdded){g(e,c);a(e,c)}else{f||(f=d.slidesJQ[e]);if(c.holder)f=c.holder;else{f=d.slidesJQ[e]=k(f);c.holder=f}c.appendOnLoaded=false;a(e,c,f);g(e,c);d._l2(c,f,b);appended=c.isAdded=true}}function g(a,c){if(!c.contentAdded){d.setItemHtml(c,b);if(!b)c.contentAdded=true}}function a(a,b,c){if(d._j){c||(c=d.slidesJQ[a]);c.css(d._g,(a+d._z+q)*d._s)}}function f(a){if(j){if(a>m-1)return f(a-m);if(a<0)return f(m+a)}return a}var d=this,i,h,j=d._v,m=d.numSlides;if(!isNaN(e))return f(e);
var l=d.currSlideId,q,n=b?Math.abs(d._k2-d.currSlideId)>=d.numSlides-1?0:1:d._u,o=Math.min(2,n),r=false,s=false,p;for(h=l;h<l+1+o;h++){p=f(h);if((i=d.slides[p])&&(!i.isAdded||!i.positionSet)){r=true;break}}for(h=l-1;h>l-1-o;h--){p=f(h);if((i=d.slides[p])&&(!i.isAdded||!i.positionSet)){s=true;break}}if(r)for(h=l;h<l+n+1;h++){p=f(h);q=Math.floor((d._q-(l-h))/d.numSlides)*d.numSlides;(i=d.slides[p])&&c(i,p)}if(s)for(h=l-1;h>l-1-n;h--){p=f(h);q=Math.floor((d._q-(l-h))/m)*m;(i=d.slides[p])&&c(i,p)}if(!b){o=
f(l-n);l=f(l+n);n=o>l?0:o;for(h=0;h<m;h++)if(!(o>l&&h>o-1)&&(h<n||h>l))if((i=d.slides[h])&&i.holder){i.holder.detach();i.isAdded=false}}},setItemHtml:function(b,e){function c(){a.isWaiting=true;b.holder.html(g._c1.clone());a.slideId=-99}var g=this,a=b.holder,f=function(a){var b=a.sizeType;return function(d){var f=a.content,h=a.holder;if(d){var i=d.currentTarget;k(i).off("load error");if(d.type==="error"){a.isLoaded=true;a.image="";a.isLoading=false;f.addClass("rsSlideError");h.html(f);a.holder.trigger("rsAfterContentSet");
g.ev.trigger("rsAfterContentSet",a);return}}if(a.image){if(a.bigImage&&a.sizeType!==b){b==="med"?a.isMedLoading=false:b==="big"?a.isBigLoading=false:a.isMedLoading=a.isLoading=false;return}if(a.isLoaded){if(!a.isRendered&&e){c();return}g._m2(a)}else{var j;if(f.hasClass("rsImg")){j=true;d=f}else{j=false;d=f.find(".rsImg")}if(d.length&&d.is("a")){j?f=k('<img class="rsImg" src="'+a.image+'" />'):f.find(".rsImg").replaceWith('<img class="rsImg" src="'+a.image+'" />');a.content=f}a.iW=i.width;if(a.iW>
0){a.iH=i.height;a.isLoaded=true;a.isLoading=false;g._m2(a)}}}else{if(!g._t&&e&&!a.isRendered){a.isRendered=true;c();return}a.isLoaded=true;a.isLoading=false}i=a.id-g._l;if(!e&&!a.appendOnLoaded&&g.st.fadeinLoadedSlide&&(i===0||(g._h2||g._g2)&&(i===-1||i===1))){f.css(g._e+"transition","opacity 400ms ease-in-out").css({visibility:"visible",opacity:0});h.html(f);setTimeout(function(){f.css("opacity",1)},6)}else h.html(f);a.isRendered=true;h.find("a").off("click.rs").on("click.rs",function(){if(g.dragSuccess)return false;
g._c2=true;g.ev.trigger("rsSlideClick");setTimeout(function(){g._c2=false},3)});a.holder.trigger("rsAfterContentSet");g.ev.trigger("rsAfterContentSet",a);a.appendOnLoaded&&g._l2(a,f,e)}};if(b.isLoaded)f(b)();else if(e)c();else if(b.image)if(b.isLoading){var d=1,i=function(){if(b.isLoading)if(b.isLoaded)f(b)();else{if(d%50===0){var a=b.imageLoader;if(a.complete&&a.naturalWidth!==void 0&&a.naturalWidth!==0&&a.naturalHeight!==0){f(b)();return}}if(!(d>300)){setTimeout(i,400);d++}}};i(b.sizeType)}else{var h=
k("<img/>"),j=b.image;if(e)c();else if(!b.isLoading){if(!j){j=h.attr("src");h=k("<img/>")}b.holder.html(g._c1.clone());b.isLoading=true;b.imageLoader=h;h.one("load error",f(b)).attr("src",j)}}else f(b)()},_l2:function(b,e,c){var g=b.holder,a=b.id-this._l;if(this._j&&!c&&this.st.fadeinLoadedSlide&&(a===0||(this._h2||this._g2)&&(a===-1||a===1))){e=b.content;e.css(this._e+"transition","opacity 400ms ease-in-out").css({visibility:"visible",opacity:0});this._b1.append(g);setTimeout(function(){e.css("opacity",
1)},6)}else this._b1.append(g);b.appendOnLoaded=false},_b2:function(b,e){var c=this,g;c.dragSuccess=false;if(k(b.target).closest(".rsNoDrag",c._d1).length)return true;e||c._h2&&c._n2();if(c._g2){if(c.hasTouch)c._o2=true}else{if(c.hasTouch)c._o2=false;c._p2();if(c.hasTouch){var a=b.originalEvent.touches;if(a&&a.length>0){g=a[0];if(a.length>1)c._o2=true}else return}else{g=b;b.preventDefault()}c._g2=true;c._a.on(c._g1,function(a){c._q2(a,e)}).on(c._h1,function(a){c._r2(a,e)});c._s2="";c._t2=false;c._u2=
g.pageX;c._v2=g.pageY;c._w2=c._r=(!e?c._f:c._x2)?g.pageX:g.pageY;c._y2=0;c._z2=0;c._a3=!e?c._m:c._b3;c._c3=(new Date).getTime();if(c.hasTouch)c._a1.on(c._i1,function(a){c._r2(a,e)})}},_d3:function(b,e){if(this._e3){var c=this._f3,g=b.pageX-this._u2,a=b.pageY-this._v2,f=this._a3+g,d=this._a3+a,i=!e?this._f:this._x2,f=i?f:d,h=this._s2;this._t2=true;this._u2=b.pageX;this._v2=b.pageY;d=i?this._u2:this._v2;if(h==="x"&&g!==0)this._y2=g>0?1:-1;else if(h==="y"&&a!==0)this._z2=a>0?1:-1;g=i?g:a;if(e)f>this._g3?
f=this._a3+g*this._j1:f<this._h3&&(f=this._a3+g*this._j1);else if(!this._v){this.currSlideId<=0&&d-this._w2>0&&(f=this._a3+g*this._j1);this.currSlideId>=this.numSlides-1&&d-this._w2<0&&(f=this._a3+g*this._j1)}this._a3=f;if(c-this._c3>200){this._c3=c;this._r=d}e?this._j3(this._a3):this._j&&this._i3(this._a3)}},_q2:function(b,e){var c=this;if(c.hasTouch){if(c._k3)return;var g=b.originalEvent.touches;if(g){if(g.length>1)return;point=g[0]}else return}else point=b;if(!c._t2){c._c&&(!e?c._b1:c._l3).css(c._e+
c._o1,"0s");(function d(){if(c._g2){c._m3=requestAnimationFrame(d);c._n3&&c._d3(c._n3,e)}})()}if(c._e3){b.preventDefault();c._f3=(new Date).getTime();c._n3=point}else{var g=!e?c._f:c._x2,a=Math.abs(point.pageX-c._u2)-Math.abs(point.pageY-c._v2)-(g?-7:7);if(a>7){if(g){b.preventDefault();c._s2="x"}else if(c.hasTouch){c._o3();return}c._e3=true}else if(a<-7){if(g){if(c.hasTouch){c._o3();return}}else{b.preventDefault();c._s2="y"}c._e3=true}}},_o3:function(){this._k3=true;this._t2=this._g2=false;this._r2()},
_r2:function(b,e){function c(a){return a<100?100:a>500?500:a}function g(b,d){if(a._j||e){i=(-a._q-a._z)*a._s;h=Math.abs(a._m-i);a._b=h/d;if(b)a._b=a._b+250;a._b=c(a._b);a._q3(i,false)}}var a=this,f,d,i,h;a.ev.trigger("rsDragRelease");a._n3=null;a._g2=false;a._k3=false;a._e3=false;a._f3=0;cancelAnimationFrame(a._m3);a._t2&&(e?a._j3(a._a3):a._j&&a._i3(a._a3));a._a.off(a._g1).off(a._h1);a.hasTouch&&a._a1.off(a._i1);a._m1();if(!a._t2&&!a._o2&&e&&a._p3){var j=k(b.target).closest(".rsNavItem");j.length&&
a.goTo(j.index())}else{d=!e?a._f:a._x2;if(a._t2&&!(a._s2==="y"&&d||a._s2==="x"&&!d)){a.dragSuccess=true;a._s2="";var m=a.st.minSlideOffset;f=a.hasTouch?b.originalEvent.changedTouches[0]:b;var l=d?f.pageX:f.pageY,q=a._w2;f=a._r;var n=a.currSlideId,o=a.numSlides,r=d?a._y2:a._z2,s=a._v;Math.abs(l-q);f=l-f;d=(new Date).getTime()-a._c3;d=Math.abs(f)/d;if(r===0||o<=1)g(true,d);else{if(!s&&!e)if(n<=0){if(r>0){g(true,d);return}}else if(n>=o-1&&r<0){g(true,d);return}if(e){i=a._b3;if(i>a._g3)i=a._g3;else if(i<
a._h3)i=a._h3;else{m=d*d/0.006;j=-a._b3;l=a._r3-a._s3+a._b3;if(f>0&&m>j){j=j+a._s3/(15/(m/d*0.003));d=d*j/m;m=j}else if(f<0&&m>l){l=l+a._s3/(15/(m/d*0.003));d=d*l/m;m=l}j=Math.max(Math.round(d/0.003),50);i=i+m*(f<0?-1:1);if(i>a._g3){a._t3(i,j,true,a._g3,200);return}if(i<a._h3){a._t3(i,j,true,a._h3,200);return}}a._t3(i,j,true)}else q+m<l?r<0?g(false,d):a._i2("prev",c(Math.abs(a._m-(-a._q-a._z+1)*a._s)/d),false,true,true):q-m>l?r>0?g(false,d):a._i2("next",c(Math.abs(a._m-(-a._q-a._z-1)*a._s)/d),false,
true,true):g(false,d)}}}},_i3:function(b){b=this._m=b;this._c?this._b1.css(this._r1,this._s1+(this._f?b+this._t1+0:0+this._t1+b)+this._u1):this._b1.css(this._f?this._r1:this._q1,b)},updateSliderSize:function(b){var e,c;this.st.beforeResize&&this.st.beforeResize.call(this);if(this.st.autoScaleSlider){var g=this.st.autoScaleSliderWidth,a=this.st.autoScaleSliderHeight;if(this.st.autoScaleHeight){e=this.slider.width();if(e!=this.width){this.slider.css("height",e*(a/g));e=this.slider.width()}c=this.slider.height()}else{c=
this.slider.height();if(c!=this.height){this.slider.css("width",c*(g/a));c=this.slider.height()}e=this.slider.width()}}else{e=this.slider.width();c=this.slider.height()}this._e2=this.slider.offset();this._e2=this._e2[this._g];if(b||e!=this.width||c!=this.height){this.width=e;this.height=c;this._u3=e;this._v3=c;this.ev.trigger("rsBeforeSizeSet");this._a1.css({width:this._u3,height:this._v3});this._s=(this._f?this._u3:this._v3)+this.st.slidesSpacing;this._w3=this.st.imageScalePadding;for(e=0;e<this.slides.length;e++){b=
this.slides[e];b.positionSet=false;if(b&&b.image&&b.isLoaded){b.isRendered=false;this._m2(b)}}if(this._x3)for(e=0;e<this._x3.length;e++){b=this._x3[e];b.holder.css(this._g,(b.id+this._z)*this._s)}this._j2();if(this._j){this._c&&this._b1.css(this._e+"transition-duration","0s");this._i3((-this._q-this._z)*this._s)}this.ev.trigger("rsOnUpdateNav");this.st.afterResize&&this.st.afterResize.call(this)}},setSlidesOrientation:function(){},appendSlide:function(b,e){var c=this._o(b);if(isNaN(e)||e>this.numSlides)e=
this.numSlides;this.slides.splice(e,0,c);this.slidesJQ.splice(e,0,'<div style="'+(this._j?"position: absolute;":"z-index: 0; display:none; opacity: 0; position: absolute;  left: 0; top: 0;")+'" class="rsSlide"></div>');e<this.currSlideId&&this.currSlideId++;this.ev.trigger("rsOnAppendSlide",[c,e]);this._z3(e);e===this.currSlideId&&this.ev.trigger("rsAfterSlideChange")},removeSlide:function(b){var e=this.slides[b];if(e){e.holder&&e.holder.remove();b<this.currSlideId&&this.currSlideId++;this.slides.splice(b,
1);this.slidesJQ.splice(b,1);this.ev.trigger("rsOnRemoveSlide",[b]);this._z3(b);b===this.currSlideId&&this.ev.trigger("rsAfterSlideChange")}},_z3:function(){var b=this,e=b.numSlides,e=b._q<=0?0:Math.floor(b._q/e);b.numSlides=b.slides.length;if(b.numSlides===0){b.currSlideId=b._z=b._q=0;b.currSlide=b._a4=null}else b._q=e*b.numSlides+b.currSlideId;for(e=0;e<b.numSlides;e++)b.slides[e].id=e;b.currSlide=b.slides[b.currSlideId];b._d1=b.slidesJQ[b.currSlideId];b.currSlideId>=b.numSlides?b.goTo(b.numSlides-
1):b.currSlideId<0&&b.goTo(0);b._p();b._j&&b._v&&b._b1.css(b._e+b._o1,"0ms");b._b4&&clearTimeout(b._b4);b._b4=setTimeout(function(){b._i3((-b._q-b._z)*b._s);b._j2()},14);b.ev.trigger("rsOnUpdateNav")},_m1:function(){if(!this.hasTouch&&this._j)if(this._k1)this._a1.css("cursor",this._k1);else{this._a1.removeClass("grabbing-cursor");this._a1.addClass("grab-cursor")}},_p2:function(){if(!this.hasTouch&&this._j)if(this._l1)this._a1.css("cursor",this._l1);else{this._a1.removeClass("grab-cursor");this._a1.addClass("grabbing-cursor")}},
next:function(b){this._i2("next",this.st.transitionSpeed,true,!b)},prev:function(b){this._i2("prev",this.st.transitionSpeed,true,!b)},_i2:function(b,e,c,g,a){var f=this,d,i,h;f._d4&&f.stopVideo();f.ev.trigger("rsBeforeMove",[b,g]);newItemId=b==="next"?f.currSlideId+1:b==="prev"?f.currSlideId-1:b=parseInt(b,10);if(!f._v){if(newItemId<0){f._e4("left",!g);return}if(newItemId>=f.numSlides){f._e4("right",!g);return}}if(f._h2){f._n2();c=false}i=newItemId-f.currSlideId;h=f._k2=f.currSlideId;var j=f.currSlideId+
i,g=f._q,m;if(f._v){j=f._j2(false,j);g=g+i}else g=j;f._l=j;f._a4=f.slidesJQ[f.currSlideId];f._q=g;f.currSlideId=f._l;f.currSlide=f.slides[f.currSlideId];f._d1=f.slidesJQ[f.currSlideId];j=Boolean(i>0);i=Math.abs(i);var l=Math.floor(h/f._u),k=Math.floor((h+(j?2:-2))/f._u),l=(j?Math.max(l,k):Math.min(l,k))*f._u+(j?f._u-1:0);l>f.numSlides-1?l=f.numSlides-1:l<0&&(l=0);h=j?l-h:h-l;if(h>f._u)h=f._u;if(i>h+2){f._z=f._z+(i-(h+2))*(j?-1:1);e=e*1.4;for(h=0;h<f.numSlides;h++)f.slides[h].positionSet=false}f._b=
e;f._j2(true);a||(m=true);d=(-g-f._z)*f._s;if(m)setTimeout(function(){f._c4=false;f._q3(d,b,false,c);f.ev.trigger("rsOnUpdateNav")},0);else{f._q3(d,b,false,c);f.ev.trigger("rsOnUpdateNav")}},_z1:function(){if(this.st.arrowsNav)if(this.numSlides<=1){this._w1.css("display","none");this._x1.css("display","none")}else{this._w1.css("display","block");this._x1.css("display","block");if(!this._v&&!this.st.loopRewind){this.currSlideId===0?this._w1.addClass("rsArrowDisabled"):this._w1.removeClass("rsArrowDisabled");
this.currSlideId===this.numSlides-1?this._x1.addClass("rsArrowDisabled"):this._x1.removeClass("rsArrowDisabled")}}},_q3:function(b,e,c,g,a){function f(){var a=i.data("rsTimeout");if(a){i!==h&&i.css({opacity:0,display:"none",zIndex:0});clearTimeout(a);i.data("rsTimeout","")}if(a=h.data("rsTimeout")){clearTimeout(a);h.data("rsTimeout","")}}var d=this,i,h,j={};if(isNaN(d._b))d._b=400;d._m=d._a3=b;d.ev.trigger("rsBeforeAnimStart");d.st.beforeSlideChange&&d.st.beforeSlideChange.call(d);if(d._c)if(d._j){j[d._e+
d._o1]=d._b+"ms";j[d._e+d._p1]=g?k.rsCSS3Easing[d.st.easeInOut]:k.rsCSS3Easing[d.st.easeOut];d._b1.css(j);setTimeout(function(){d._i3(b)},d.hasTouch?5:0)}else{d._b=d.st.transitionSpeed;i=d._a4;h=d._d1;h.data("rsTimeout")&&h.css("opacity",0);f();i&&i.data("rsTimeout",setTimeout(function(){j[d._e+d._o1]="0ms";j.zIndex=0;j.display="none";i.data("rsTimeout","");i.css(j);setTimeout(function(){i.css("opacity",0)},16)},d._b+60));j.display="block";j.zIndex=d._k;j.opacity=0;j[d._e+d._o1]="0ms";j[d._e+d._p1]=
k.rsCSS3Easing[d.st.easeInOut];h.css(j);h.data("rsTimeout",setTimeout(function(){h.css(d._e+d._o1,d._b+"ms");h.data("rsTimeout",setTimeout(function(){h.css("opacity",1);h.data("rsTimeout","")},20))},20))}else if(d._j){j[d._f?d._r1:d._q1]=b+"px";d._b1.animate(j,d._b,g?d.st.easeInOut:d.st.easeOut)}else{i=d._a4;h=d._d1;h.stop(true,true).css({opacity:0,display:"block",zIndex:d._k});d._b=d.st.transitionSpeed;h.animate({opacity:1},d._b,d.st.easeInOut);f();i&&i.data("rsTimeout",setTimeout(function(){i.stop(true,
true).css({opacity:0,display:"none",zIndex:0})},d._b+60))}d._h2=true;d.loadingTimeout&&clearTimeout(d.loadingTimeout);d.loadingTimeout=a?setTimeout(function(){d.loadingTimeout=null;a.call()},d._b+60):setTimeout(function(){d.loadingTimeout=null;d._f4(e)},d._b+60)},_n2:function(){this._h2=false;clearTimeout(this.loadingTimeout);if(this._j)if(this._c){var b=this._m,e=this._a3=this._g4();this._b1.css(this._e+this._o1,"0ms");b!==e&&this._i3(e)}else{this._b1.stop(true);this._m=parseInt(this._b1.css(this._r1),
10)}else this._k>20?this._k=10:this._k++},_g4:function(){var b=window.getComputedStyle(this._b1.get(0),null).getPropertyValue(this._e+"transform").replace(/^matrix\(/i,"").split(/, |\)$/g);return parseInt(b[this._f?4:5],10)},_h4:function(b,e){return this._c?this._s1+(e?b+this._t1+0:0+this._t1+b)+this._u1:b},_f4:function(){if(!this._j){this._d1.css("z-index",0);this._k=10}this._h2=false;this.staticSlideId=this.currSlideId;this._j2();this._i4=false;this.ev.trigger("rsAfterSlideChange");this.st.afterSlideChange&&
this.st.afterSlideChange.call(this)},_e4:function(b,e){var c=this,g=(-c._q-c._z)*c._s;moveDist=30;if(c.numSlides!==0)if(c.st.loopRewind)b==="left"?c.goTo(c.numSlides-1,e):c.goTo(0,e);else if(!c._h2&&c._j&&moveDist!==0){c._b=200;var a=function(){c._h2=false};c._q3(g+(b==="left"?moveDist:-moveDist),"",false,true,function(){c._h2=false;c._q3(g,"",false,true,a)})}},_m2:function(b){if(!b.isRendered){var e=b.content,c="rsImg",g,a=this.st.imageAlignCenter,f=this.st.imageScaleMode,d;if(b.videoURL){c="rsVideoContainer";
if(f!=="fill")g=true;else{d=e;d.hasClass(c)||(d=d.find("."+c));d.css({width:"100%",height:"100%"});c="rsImg"}}e.hasClass(c)||(e=e.find("."+c));var i=b.iW,c=b.iH;b.isRendered=true;if(f!=="none"||a){bMargin=f!=="fill"?this._w3:0;b=this._u3-bMargin*2;d=this._v3-bMargin*2;var h,j,k={};if(f==="fit-if-smaller"&&(i>b||c>d))f="fit";if(f==="fill"||f==="fit"){h=b/i;j=d/c;h=f=="fill"?h>j?h:j:f=="fit"?h<j?h:j:1;i=Math.ceil(i*h,10);c=Math.ceil(c*h,10)}if(f!=="none"){k.width=i;k.height=c;g&&e.find(".rsImg").css({width:"100%",
height:"100%"})}if(a){k.marginLeft=Math.floor((b-i)/2)+bMargin;k.marginTop=Math.floor((d-c)/2)+bMargin}e.css(k)}}}};k.rsProto=t.prototype;k.fn.royalSlider=function(b){var e=arguments;return this.each(function(){var c=k(this);if(typeof b==="object"||!b)c.data("royalSlider")||c.data("royalSlider",new t(c,b));else if((c=c.data("royalSlider"))&&c[b])return c[b].apply(c,Array.prototype.slice.call(e,1))})};k.fn.royalSlider.defaults={slidesSpacing:8,startSlideId:0,loop:!1,loopRewind:!1,numImagesToPreload:4,
fadeinLoadedSlide:!0,slidesOrientation:"horizontal",transitionType:"move",transitionSpeed:600,controlNavigation:"bullets",controlsInside:!0,arrowsNav:!0,arrowsNavAutoHide:!0,navigateByClick:!0,randomizeSlides:!1,sliderDrag:!0,sliderTouch:!0,keyboardNavEnabled:!1,fadeInAfterLoaded:!0,allowCSS3:!0,allowCSS3OnWebkit:!0,addActiveClass:!1,autoHeight:!1,easeOut:"easeOutSine",easeInOut:"easeInOutSine",minSlideOffset:10,imageScaleMode:"fit-if-smaller",imageAlignCenter:!0,imageScalePadding:4,autoScaleSlider:!1,
autoScaleSliderWidth:800,autoScaleSliderHeight:400,autoScaleHeight:!0,arrowsNavHideOnTouch:!1,globalCaption:!1,beforeSlideChange:null,afterSlideChange:null,beforeResize:null,afterResize:null};k.rsCSS3Easing={easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)"};k.extend(jQuery.easing,{easeInOutSine:function(b,e,c,g,a){return-g/2*(Math.cos(Math.PI*e/a)-1)+c},easeOutSine:function(b,e,c,g,a){return g*Math.sin(e/a*(Math.PI/2))+c},easeOutCubic:function(b,
e,c,g,a){return g*((e=e/a-1)*e*e+1)+c}})})(jQuery);
// jquery.rs.active-class v1.0
(function(b){b.rsProto._j4=function(){var c,a=this;if(a.st.addActiveClass){a.ev.on("rsBeforeMove",function(){b()});a.ev.on("rsAfterInit",function(){b()});var b=function(){c&&clearTimeout(c);c=setTimeout(function(){a._a4&&a._a4.removeClass("rsActiveSlide");a._d1&&a._d1.addClass("rsActiveSlide");c=null},50)}}};b.rsModules.activeClass=b.rsProto._j4})(jQuery);
// jquery.rs.animated-blocks v1.0.2
(function(i){i.extend(i.rsProto,{_k4:function(){function j(){var e=a.currSlide;if(a.currSlide&&a.currSlide.isLoaded&&a._o4!==e){if(0<a._n4.length){for(b=0;b<a._n4.length;b++)clearTimeout(a._n4[b]);a._n4=[]}if(0<a._m4.length){var g;for(b=0;b<a._m4.length;b++)if(g=a._m4[b])a._c?(g.block.css(a._e+a._o1,"0s"),g.block.css(g.css)):g.running?g.block.stop(!0,!0):g.block.css(g.css),a._o4=null,e.animBlocksDisplayed=!1;a._m4=[]}e.animBlocks&&(e.animBlocksDisplayed=!0,a._o4=e,a._p4(e.animBlocks))}}var a=this,
b;a._l4={fadeEffect:!0,moveEffect:"top",moveOffset:20,speed:400,easing:"easeOutSine",delay:200};a.st.block=i.extend({},a._l4,a.st.block);a._m4=[];a._n4=[];a.ev.on("rsAfterInit",function(){j()});a.ev.on("rsBeforeParseNode",function(a,b,c){b=i(b);c.animBlocks=b.find(".rsABlock").css("display","none");c.animBlocks.length||(c.animBlocks=b.hasClass("rsABlock")?b.css("display","none"):!1)});a.ev.on("rsAfterContentSet",function(b,g){g.id===a.currSlideId&&setTimeout(function(){j()},a.st.fadeinLoadedSlide?
300:0)});a.ev.on("rsAfterSlideChange",function(){j()})},_q4:function(i,a){setTimeout(function(){i.css(a)},6)},_p4:function(j){var a=this,b,e,g,c;a._n4=[];j.each(function(j){b=i(this);e={};g={};c=null;var f=b.data("move-offset");isNaN(f)&&(f=a.st.block.moveOffset);if(0<f){var d=b.data("move-effect");d?(d=d.toLowerCase(),"none"===d?d=!1:"left"!==d&&("top"!==d&&"bottom"!==d&&"right"!==d)&&(d=a.st.block.moveEffect,"none"===d&&(d=!1))):d=a.st.block.moveEffect;if(d){var l;l="right"===d||"left"===d?!0:!1;
var k,h;isOppositeProp=!1;a._c?(k=0,h=a._r1):(l?isNaN(parseInt(b.css("right"),10))?h="left":(h="right",isOppositeProp=!0):isNaN(parseInt(b.css("bottom"),10))?h="top":(h="bottom",isOppositeProp=!0),h="margin-"+h,isOppositeProp&&(f=-f),k=parseInt(b.css(h),10));g[h]=a._h4("top"===d||"left"===d?k-f:k+f,l);e[h]=a._h4(k,l)}}if(f=b.attr("data-fade-effect")){if("none"===f.toLowerCase()||"false"===f.toLowerCase())f=!1}else f=a.st.block.fadeEffect;f&&(g.opacity=0,e.opacity=1);if(f||d)if(c={},c.hasFade=Boolean(f),
Boolean(d)&&(c.moveProp=h,c.hasMove=!0),c.speed=b.data("speed"),isNaN(c.speed)&&(c.speed=a.st.block.speed),c.easing=b.data("easing"),c.easing||(c.easing=a.st.block.easing),c.css3Easing=i.rsCSS3Easing[c.easing],c.delay=b.data("delay"),isNaN(c.delay))c.delay=a.st.block.delay*j;d={};a._c&&(d[a._e+a._o1]="0ms");d.moveProp=e.moveProp;d.opacity=e.opacity;d.display="none";a._m4.push({block:b,css:d});a._q4(b,g);a._n4.push(setTimeout(function(b,d,c,g){return function(){b.css("display","block");if(c){var f=
{};if(a._c){var e="";c.hasMove&&(e=e+c.moveProp);if(c.hasFade){c.hasMove&&(e=e+", ");e=e+"opacity"}f[a._e+a._n1]=e;f[a._e+a._o1]=c.speed+"ms";f[a._e+a._p1]=c.css3Easing;b.css(f);setTimeout(function(){b.css(d)},24)}else setTimeout(function(){b.animate(d,c.speed,c.easing)},16)}delete a._n4[g]}}(b,e,c,j),6>=c.delay?12:c.delay))})}});i.rsModules.animatedBlocks=i.rsProto._k4})(jQuery);
// jquery.rs.auto-height v1.0.1
(function(b){b.extend(b.rsProto,{_r4:function(){var a=this;if(a.st.autoHeight){var b,c;a.slider.addClass("rsAutoHeight");a.ev.on("rsAfterInit",function(){setTimeout(function(){d(!1);setTimeout(function(){a.slider.append('<div id="clear" style="clear:both;"></div>');a._c&&a._a1.css(a._e+"transition","height "+a.st.transitionSpeed+"ms ease-in-out")},16)},16)});a.ev.on("rsBeforeAnimStart",function(){d(!0)});a.ev.on("rsBeforeSizeSet",function(){setTimeout(function(){d(!1)},16)});var d=function(f){var e=
a.slides[a.currSlideId];b=e.holder;if(e.isLoaded)b&&(c=b.height(),0!==c&&void 0!==c&&(a._v3=c,a._c||!f?a._a1.css("height",c):a._a1.stop(!0,!0).animate({height:c},a.st.transitionSpeed)));else a.ev.off("rsAfterContentSet.rsAutoHeight").on("rsAfterContentSet.rsAutoHeight",function(a,b){e===b&&d()})}}}});b.rsModules.autoHeight=b.rsProto._r4})(jQuery);
// jquery.rs.autoplay v1.0.2
(function(b){b.extend(b.rsProto,{_u4:function(){var a=this,d;a._v4={enabled:!1,stopAtAction:!0,pauseOnHover:!0,delay:2E3};a.st.autoPlay=b.extend({},a._v4,a.st.autoPlay);a.st.autoPlay.enabled&&(a.ev.on("rsBeforeParseNode",function(a,c,e){c=b(c);if(d=c.attr("data-rsDelay"))e.customDelay=parseInt(d,10)}),a.ev.one("rsAfterInit",function(){a._w4()}),a.ev.on("rsBeforeDestroy",function(){a.stopAutoPlay()}))},_w4:function(){var a=this;a.startAutoPlay();a.ev.on("rsAfterContentSet",function(d,b){!a._g2&&(!a._h2&&
a._x4&&b===a.currSlide)&&a._y4()});a.ev.on("rsDragRelease",function(){a._x4&&a._z4&&(a._z4=!1,a._y4())});a.ev.on("rsAfterSlideChange",function(){a._x4&&a._z4&&(a._z4=!1,a.currSlide.isLoaded&&a._y4())});a.ev.on("rsDragStart",function(){a._x4&&(a.st.autoPlay.stopAtAction?a.stopAutoPlay():(a._z4=!0,a._a5()))});a.ev.on("rsBeforeMove",function(b,f,c){a._x4&&(c&&a.st.autoPlay.stopAtAction?a.stopAutoPlay():(a._z4=!0,a._a5()))});a._b5=!1;a.ev.on("rsVideoStop",function(){a._x4&&(a._b5=!1,a._y4())});a.ev.on("rsVideoPlay",
function(){a._x4&&(a._z4=!1,a._a5(),a._b5=!0)});a.st.autoPlay.pauseOnHover&&(a._c5=!1,a.slider.hover(function(){a._x4&&(a._z4=!1,a._a5(),a._c5=!0)},function(){a._x4&&(a._c5=!1,a._y4())}))},toggleAutoplay:function(){this._x4?this.startAutoPlay():this.stopAutoPlay()},startAutoPlay:function(){this._x4=!0;this.currSlide.isLoaded&&this._y4()},stopAutoPlay:function(){this._b5=this._c5=this._z4=this._x4=!1;this._a5()},_y4:function(){var a=this;!a._c5&&!a._b5&&(a._d5=!0,a._e5&&clearTimeout(a._e5),a._e5=setTimeout(function(){var b;
!a._v&&!a.st.loopRewind&&(b=!0,a.st.loopRewind=!0);a.next(!0);b&&(a.st.loopRewind=!1)},!a.currSlide.customDelay?a.st.autoPlay.delay:a.currSlide.customDelay))},_a5:function(){!this._c5&&!this._b5&&(this._d5=!1,this._e5&&(clearTimeout(this._e5),this._e5=null))}});b.rsModules.autoplay=b.rsProto._u4})(jQuery);
// jquery.rs.bullets v1.0
(function(c){c.extend(c.rsProto,{_f5:function(){var a=this;"bullets"===a.st.controlNavigation&&(a.ev.one("rsAfterPropsSetup",function(){a._g5=!0;a.slider.addClass("rsWithBullets");for(var b='<div class="rsNav rsBullets">',e=0;e<a.numSlides;e++)b+='<div class="rsNavItem rsBullet"><span class=""></span></div>';b=c(b+"</div>");a._t4=b;a._h5=b.children();a.slider.append(b);a._t4.click(function(b){b=c(b.target).closest(".rsNavItem");b.length&&a.goTo(b.index())})}),a.ev.on("rsOnAppendSlide",function(b,
c,d){d>=a.numSlides?a._t4.append('<div class="rsNavItem rsBullet"><span class=""></span></div>'):a._h5.eq(d).before('<div class="rsNavItem rsBullet"><span class=""></span></div>');a._h5=a._t4.children()}),a.ev.on("rsOnRemoveSlide",function(b,c){var d=a._h5.eq(c);d&&(d.remove(),a._h5=a._t4.children())}),a.ev.on("rsOnUpdateNav",function(){var b=a.currSlideId;a._i5&&a._i5.removeClass("rsNavSelected");b=c(a._h5[b]);b.addClass("rsNavSelected");a._i5=b}))}});c.rsModules.bullets=c.rsProto._f5})(jQuery);
// jquery.rs.deeplinking v1.0.1 + jQuery hashchange plugin v1.3 Copyright (c) 2010
(function(a){a.extend(a.rsProto,{_j5:function(){var b=this,g,d,e;b._k5={enabled:!1,change:!1,prefix:""};b.st.deeplinking=a.extend({},b._k5,b.st.deeplinking);if(b.st.deeplinking.enabled){var j=b.st.deeplinking.change,c="#"+b.st.deeplinking.prefix,f=function(){var a=window.location.hash;return a&&(a=parseInt(a.substring(c.length),10),0<=a)?a-1:-1},h=f();-1!==h&&(b.st.startSlideId=h);if(j)a(window).on("hashchange.rs",function(){if(!g){var a=f();a<0?a=0:a>b.numSlides-1&&(a=b.numSlides-1);b.goTo(a)}});
b.ev.on("rsAfterSlideChange",function(){d&&clearTimeout(d);e&&clearTimeout(e);e=setTimeout(function(){g=true;window.location.hash=c+(b.currSlideId+1);d=setTimeout(function(){g=false;d=0},60)},750)})}}});a.rsModules.deeplinking=a.rsProto._j5})(jQuery);
(function(a,b,g){function d(a){a=a||location.href;return"#"+a.replace(/^[^#]*#?(.*)$/,"$1")}"$:nomunge";var e=document,j,c=a.event.special,f=e.documentMode,h="onhashchange"in b&&(f===g||7<f);a.fn.hashchange=function(a){return a?this.bind("hashchange",a):this.trigger("hashchange")};a.fn.hashchange.delay=50;c.hashchange=a.extend(c.hashchange,{setup:function(){if(h)return!1;a(j.start)},teardown:function(){if(h)return!1;a(j.stop)}});var n=function(){var c=d(),e=p(m);c!==m?(o(m=c,e),a(b).trigger("hashchange")):
e!==m&&(location.href=location.href.replace(/#.*/,"")+e);k=setTimeout(n,a.fn.hashchange.delay)},c={},k,m=d(),o=f=function(a){return a},p=f;c.start=function(){k||n()};c.stop=function(){k&&clearTimeout(k);k=g};if(a.browser.msie&&!h){var i,l;c.start=function(){i||(l=(l=a.fn.hashchange.src)&&l+d(),i=a('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){l||o(d());n()}).attr("src",l||"javascript:0").insertAfter("body")[0].contentWindow,e.onpropertychange=function(){try{"title"===event.propertyName&&
(i.document.title=e.title)}catch(a){}})};c.stop=f;p=function(){return d(i.location.href)};o=function(b,c){var d=i.document,f=a.fn.hashchange.domain;b!==c&&(d.title=e.title,d.open(),f&&d.write('<script>document.domain="'+f+'"<\/script>'),d.close(),i.location.hash=b)}}j=c})(jQuery,this);
// jquery.rs.fullscreen v1.0
(function(c){c.extend(c.rsProto,{_l5:function(){var a=this;a._m5={enabled:!1,keyboardNav:!0,buttonFS:!0,nativeFS:!1,doubleTap:!0};a.st.fullscreen=c.extend({},a._m5,a.st.fullscreen);if(a.st.fullscreen.enabled)a.ev.one("rsBeforeSizeSet",function(){a._n5()})},_n5:function(){var a=this;a._o5=!a.st.keyboardNavEnabled&&a.st.fullscreen.keyboardNav;if(a.st.fullscreen.nativeFS){a._p5={supportsFullScreen:!1,isFullScreen:function(){return!1},requestFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",
prefix:""};var b=["webkit","moz","o","ms","khtml"];if("undefined"!=typeof document.cancelFullScreen)a._p5.supportsFullScreen=!0;else for(var d=0;d<b.length;d++)if(a._p5.prefix=b[d],"undefined"!=typeof document[a._p5.prefix+"CancelFullScreen"]){a._p5.supportsFullScreen=!0;break}a._p5.supportsFullScreen?(a._p5.fullScreenEventName=a._p5.prefix+"fullscreenchange.rs",a._p5.isFullScreen=function(){switch(this.prefix){case "":return document.fullScreen;case "webkit":return document.webkitIsFullScreen;default:return document[this.prefix+
"FullScreen"]}},a._p5.requestFullScreen=function(a){return""===this.prefix?a.requestFullScreen():a[this.prefix+"RequestFullScreen"]()},a._p5.cancelFullScreen=function(){return""===this.prefix?document.cancelFullScreen():document[this.prefix+"CancelFullScreen"]()}):a._p5=!1}a.st.fullscreen.buttonFS&&(a._q5=c('<div class="rsFullscreenBtn"><div class="rsFullscreenIcn"></div></div>').appendTo(a.st.controlsInside?a._a1:a.slider).on("click.rs",function(){a.isFullscreen?a.exitFullscreen():a.enterFullscreen()}))},
enterFullscreen:function(a){var b=this;if(b._p5)if(a)b._p5.requestFullScreen(c("html")[0]);else{b._a.on(b._p5.fullScreenEventName,function(){b._p5.isFullScreen()?b.enterFullscreen(!0):b.exitFullscreen(!0)});b._p5.requestFullScreen(c("html")[0]);return}if(!b._r5){b._r5=!0;b._a.on("keyup.rsfullscreen",function(a){27===a.keyCode&&b.exitFullscreen()});b._o5&&b._v1();b._s5=c("html").attr("style");b._t5=c("body").attr("style");b._u5=b.slider.attr("style");c("body, html").css({overflow:"hidden",height:"100%",
width:"100%",margin:"0",padding:"0"});b.slider.addClass("rsFullscreen");var d;for(d=0;d<b.numSlides;d++)if(a=b.slides[d],a.isRendered=!1,a.bigImage){a.isMedLoaded=a.isLoaded;a.isMedLoading=a.isLoading;a.medImage=a.image;a.medIW=a.iW;a.medIH=a.iH;a.slideId=-99;a.bigImage!==a.medImage&&(a.sizeType="big");a.isLoaded=a.isBigLoaded;a.isLoading=a.isBigLoading;a.image=a.bigImage;a.iW=a.bigIW;a.iH=a.bigIH;a.contentAdded=!1;var e=!a.isLoaded?'<a class="rsImg" href="'+a.image+'"></a>':'<img class="rsImg" src="'+
a.image+'"/>';a.content.hasClass("rsImg")?a.content=c(e):a.content.find(".rsImg").replaceWith(e)}b.isFullscreen=!0;setTimeout(function(){b._r5=!1;b.updateSliderSize()},100)}},exitFullscreen:function(a){var b=this;if(b._p5){if(!a){b._p5.cancelFullScreen(c("html")[0]);return}b._a.off(b._p5.fullScreenEventName)}if(!b._r5){b._r5=!0;b._a.off("keyup.rsfullscreen");b._o5&&b._a.off("keydown.rskb");c("html").attr("style",b._s5||"");c("body").attr("style",b._t5||"");b.slider.removeClass("rsFullscreen");var d;
for(d=0;d<b.numSlides;d++)if(a=b.slides[d],a.isRendered=!1,a.bigImage){a.slideId=-99;a.isBigLoaded=a.isLoaded;a.isBigLoading=a.isLoading;a.bigImage=a.image;a.bigIW=a.iW;a.bigIH=a.iH;a.isLoaded=a.isMedLoaded;a.isLoading=a.isMedLoading;a.image=a.medImage;a.iW=a.medIW;a.iH=a.medIH;a.contentAdded=!1;var e=!a.isLoaded?'<a class="rsImg" href="'+a.image+'"></a>':'<img class="rsImg" src="'+a.image+'"/>';a.content.hasClass("rsImg")?a.content=c(e):a.content.find(".rsImg").replaceWith(e);a.holder&&a.holder.html(a.content);
a.bigImage!==a.medImage&&(a.sizeType="med")}b.isFullscreen=!1;setTimeout(function(){b._r5=!1;b.updateSliderSize()},100)}}});c.rsModules.fullscreen=c.rsProto._l5})(jQuery);
// jquery.rs.global-caption v1.0
(function(b){b.extend(b.rsProto,{_v5:function(){var a=this;a.st.globalCaption&&(a.ev.on("rsAfterInit",function(){a.globalCaption=b('<div class="rsGCaption"></div>').appendTo(a.slider);a.globalCaption.html(a.currSlide.caption)}),a.ev.on("rsBeforeAnimStart",function(){a.globalCaption.html(a.currSlide.caption)}))}});b.rsModules.globalCaption=b.rsProto._v5})(jQuery);
// jquery.rs.nav-auto-hide v1.0
(function(b){b.extend(b.rsProto,{_s4:function(){var a=this;if(a.st.navAutoHide&&!a.hasTouch)a.ev.one("rsAfterInit",function(){if(a._t4){a._t4.addClass("rsHidden");var b=a.slider;b.one("mousemove.controlnav",function(){a._t4.removeClass("rsHidden")});b.hover(function(){a._t4.removeClass("rsHidden")},function(){a._t4.addClass("rsHidden")})}})}});b.rsModules.autoHideNav=b.rsProto._s4})(jQuery);
// jquery.rs.tabs v1.0.1
(function(e){e.extend(e.rsProto,{_w5:function(){var a=this;"tabs"===a.st.controlNavigation&&(a.ev.on("rsBeforeParseNode",function(a,d,b){d=e(d);b.thumbnail=d.find(".rsTmb").remove();b.thumbnail.length?b.thumbnail=e(document.createElement("div")).append(b.thumbnail).html():(b.thumbnail=d.attr("data-rsTmb"),b.thumbnail||(b.thumbnail=d.find(".rsImg").attr("data-rsTmb")),b.thumbnail=b.thumbnail?'<img src="'+b.thumbnail+'"/>':"")}),a.ev.one("rsAfterPropsSetup",function(){a._x5()}),a.ev.on("rsOnAppendSlide",
function(c,d,b){b>=a.numSlides?a._t4.append('<div class="rsNavItem rsTab">'+d.thumbnail+"</div>"):a._h5.eq(b).before('<div class="rsNavItem rsTab">'+item.thumbnail+"</div>");a._h5=a._t4.children()}),a.ev.on("rsOnRemoveSlide",function(c,d){var b=a._h5.eq(d);b&&(b.remove(),a._h5=a._t4.children())}),a.ev.on("rsOnUpdateNav",function(){var c=a.currSlideId;a._i5&&a._i5.removeClass("rsNavSelected");c=e(a._h5[c]);c.addClass("rsNavSelected");a._i5=c}))},_x5:function(){var a=this,c,d;a._g5=!0;c='<div class="rsNav rsTabs">';
for(var b=0;b<a.numSlides;b++)b===a.numSlides-1&&(style=""),d=a.slides[b],c+='<div class="rsNavItem rsTab">'+d.thumbnail+"</div>";c=e(c+"</div>");a._t4=c;a._h5=c.find(".rsNavItem");a.slider.append(c);a._t4.click(function(b){b=e(b.target).closest(".rsNavItem");b.length&&a.goTo(b.index())})}});e.rsModules.tabs=e.rsProto._w5})(jQuery);
// jquery.rs.thumbnails v1.0.2
(function(f){f.extend(f.rsProto,{_y5:function(){var a=this;"thumbnails"===a.st.controlNavigation&&(a._z5={drag:!0,touch:!0,orientation:"horizontal",navigation:!0,arrows:!0,arrowLeft:null,arrowRight:null,spacing:4,arrowsAutoHide:!1,appendSpan:!1,transitionSpeed:600,autoCenter:!0,fitInViewport:!0,firstMargin:!0},a.st.thumbs=f.extend({},a._z5,a.st.thumbs),a.ev.on("rsBeforeParseNode",function(a,b,c){b=f(b);c.thumbnail=b.find(".rsTmb").remove();c.thumbnail.length?c.thumbnail=f(document.createElement("div")).append(c.thumbnail).html():
(c.thumbnail=b.attr("data-rsTmb"),c.thumbnail||(c.thumbnail=b.find(".rsImg").attr("data-rsTmb")),c.thumbnail=c.thumbnail?'<img src="'+c.thumbnail+'"/>':"")}),a.ev.one("rsAfterPropsSetup",function(){a._a6()}),a.ev.on("rsOnUpdateNav",function(){var e=a.currSlideId,b;a._i5&&a._i5.removeClass("rsNavSelected");b=f(a._h5[e]);b.addClass("rsNavSelected");a._b6&&a._c6(e);a._i5=b}),a.ev.on("rsOnAppendSlide",function(e,b,c){e="<div"+a._d6+' class="rsNavItem rsThumb">'+a._e6+b.thumbnail+"</div>";c>=a.numSlides?
a._l3.append(e):a._h5.eq(c).before(e);a._h5=a._l3.children();a.updateThumbsSize()}),a.ev.on("rsOnRemoveSlide",function(e,b){var c=a._h5.eq(b);c&&(c.remove(),a._h5=a._l3.children(),a.updateThumbsSize())}))},_a6:function(){var a=this,e="rsThumbs",b="",c,g,d=a.st.thumbs.spacing;a._g5=!0;0<d?(c=d+"px ",c=' style="margin: 0 '+c+c+'0;"'):c="";a._d6=c;a._x2="vertical"===a.st.thumbs.orientation?!1:!0;a._b3=0;a._f6=!1;a._g6=!1;a._b6=!1;a._h6=a.st.thumbs.arrows&&a.st.thumbs.navigation;g=a._x2?"Hor":"Ver";a.slider.addClass("rsWithThumbs rsWithThumbs"+
g);b+='<div class="rsNav rsThumbs rsThumbs'+g+'"><div class="'+e+'Container">';a._e6=a.st.thumbs.appendSpan?'<span class="thumbIco"></span>':"";for(var h=0;h<a.numSlides;h++)g=a.slides[h],b+="<div"+c+' class="rsNavItem rsThumb">'+a._e6+g.thumbnail+"</div>";b=f(b+"</div></div>");a._l3=f(b).find("."+e+"Container");if(a._h6&&(e+="Arrow",a.st.thumbs.arrowLeft?a._i6=a.st.thumbs.arrowLeft:(a._i6=f('<div class="'+e+" "+e+'Left"><div class="'+e+'Icn"></div></div>'),b.append(a._i6)),a.st.thumbs.arrowRight?
a._j6=a.st.thumbs.arrowRight:(a._j6=f('<div class="'+e+" "+e+'Right"><div class="'+e+'Icn"></div></div>'),b.append(a._j6)),a._i6.click(function(){var b=(Math.floor(a._b3/a._k6)+a._l6)*a._k6;a._t3(b>a._g3?a._g3:b)}),a._j6.click(function(){var b=(Math.floor(a._b3/a._k6)-a._l6)*a._k6;a._t3(b<a._h3?a._h3:b)}),a.st.thumbs.arrowsAutoHide&&!a.hasTouch))a._i6.css("opacity",0),a._j6.css("opacity",0),b.one("mousemove.rsarrowshover",function(){if(a._b6){a._i6.css("opacity",1);a._j6.css("opacity",1)}}),b.hover(function(){if(a._b6){a._i6.css("opacity",
1);a._j6.css("opacity",1)}},function(){if(a._b6){a._i6.css("opacity",0);a._j6.css("opacity",0)}});a._t4=b;a._h5=a._l3.children();a.slider.append(b);a._p3=!0;a._m6=d;a.st.thumbs.navigation&&a._c&&a._l3.css(a._e+"transition-property",a._e+"transform");a._t4.click(function(b){if(!a._g6){b=f(b.target).closest(".rsNavItem");b.length&&a.goTo(b.index())}});a.ev.off("rsBeforeSizeSet.thumbs").on("rsBeforeSizeSet.thumbs",function(){a._n6=a._x2?a._v3:a._u3;a.updateThumbsSize()})},updateThumbsSize:function(){var a=
this,e=a._h5.first(),b={},c=a._h5.length;a._k6=(a._x2?e.outerWidth():e.outerHeight())+a._m6;a._r3=c*a._k6-a._m6;b[a._x2?"width":"height"]=a._r3+a._m6;a._s3=a._x2?a._t4.width():a._t4.height();a._h3=-(a._r3-a._s3)-(a.st.thumbs.firstMargin?a._m6:0);a._g3=a.st.thumbs.firstMargin?a._m6:0;a._l6=Math.floor(a._s3/a._k6);if(a._r3<a._s3)a.st.thumbs.autoCenter&&a._j3((a._s3-a._r3)/2),a.st.thumbs.arrows&&a._i6&&(a._i6.addClass("rsThumbsArrowDisabled"),a._j6.addClass("rsThumbsArrowDisabled")),a._b6=!1,a._g6=!1,
a._t4.off(a._f1);else if(a.st.thumbs.navigation&&!a._b6&&(a._b6=!0,!a.hasTouch&&a.st.thumbs.drag||a.hasTouch&&a.st.thumbs.touch))a._g6=!0,a._t4.on(a._f1,function(b){a._b2(b,!0)});a._l3.css(b);if(a._p3&&(a.isFullscreen||a.st.thumbs.fitInViewport))a._x2?a._v3=a._n6-a._t4.outerHeight():a._u3=a._n6-a._t4.outerWidth()},setThumbsOrientation:function(a,e){this._p3&&(this.st.thumbs.orientation=a,this._t4.remove(),this.slider.removeClass("rsWithThumbsHor rsWithThumbsVer"),this._a6(),this._t4.off(this._f1),
e||this.updateSliderSize(!0))},_j3:function(a){this._b3=a;this._c?this._l3.css(this._r1,this._s1+(this._x2?a+this._t1+0:0+this._t1+a)+this._u1):this._l3.css(this._x2?this._r1:this._q1,a)},_t3:function(a,e,b,c,g){var d=this;if(d._b6){e||(e=d.st.thumbs.transitionSpeed);d._b3=a;d._o6&&clearTimeout(d._o6);d._f6&&(d._c||d._l3.stop(),b=!0);var h={};d._f6=!0;d._c?(h[d._e+"transition-duration"]=e+"ms",h[d._e+"transition-timing-function"]=b?f.rsCSS3Easing[d.st.easeOut]:f.rsCSS3Easing[d.st.easeInOut],d._l3.css(h),
d._j3(a)):(h[d._x2?d._r1:d._q1]=a+"px",d._l3.animate(h,e,b?"easeOutCubic":d.st.easeInOut));c&&(d._b3=c);d._p6();d._o6=setTimeout(function(){d._f6=false;if(g){d._t3(c,g,true);g=null}},e)}},_p6:function(){this._h6&&(this._b3===this._g3?this._i6.addClass("rsThumbsArrowDisabled"):this._i6.removeClass("rsThumbsArrowDisabled"),this._b3===this._h3?this._j6.addClass("rsThumbsArrowDisabled"):this._j6.removeClass("rsThumbsArrowDisabled"))},_c6:function(a,e){var b=0,c,f=a*this._k6+2*this._k6-this._m6+this._g3,
d=Math.floor(this._b3/this._k6);this._b6&&(f+this._b3>this._s3?(a===this.numSlides-1&&(b=1),d=-a+this._l6-2+b,c=d*this._k6+this._s3%this._k6+this._m6-this._g3):0!==a?(a-1)*this._k6<=-this._b3+this._g3&&a-1<=this.numSlides-this._l6&&(c=(-a+1)*this._k6+this._g3):c=this._g3,c!==this._b3&&(b=void 0===c?this._b3:c,b>this._g3?this._j3(this._g3):b<this._h3?this._j3(this._h3):void 0!==c&&(e?this._j3(c):this._t3(c))),this._p6())}});f.rsModules.thumbnails=f.rsProto._y5})(jQuery);
// jquery.rs.video v1.0.3
(function(e){e.extend(e.rsProto,{_q6:function(){var a=this;a._r6={autoHideArrows:!0,autoHideControlNav:!1,autoHideBlocks:!1,youTubeCode:'<iframe src="http://www.youtube.com/embed/%id%?rel=1&autoplay=1&showinfo=0&autoplay=1" frameborder="no"></iframe>',vimeoCode:'<iframe src="http://player.vimeo.com/video/%id%?byline=0&amp;portrait=0&amp;autoplay=1" frameborder="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'};a.st.video=e.extend({},a._r6,a.st.video);a.ev.on("rsBeforeSizeSet",
function(){a._d4&&setTimeout(function(){var b=a._d1,b=b.hasClass("rsVideoContainer")?b:b.find(".rsVideoContainer");a._s6.css({width:b.width(),height:b.height()})},32)});var d=e.browser.mozilla;a.ev.on("rsAfterParseNode",function(b,f,c){b=e(f);if(c.videoURL){d&&(a._c=a._d=!1);var f=e('<div class="rsVideoContainer"></div>'),g=e('<div class="rsBtnCenterer"><div class="rsPlayBtn"><div class="rsPlayBtnIcon"></div></div></div>');b.hasClass("rsImg")?c.content=f.append(b).append(g):c.content.find(".rsImg").wrap(f).after(g)}})},
toggleVideo:function(){return this._d4?this.stopVideo():this.playVideo()},playVideo:function(){var a=this;if(!a._d4){var d=a.currSlide;if(!d.videoURL)return!1;var b=a._t6=d.content,d=d.videoURL,f,c;d.match(/youtu\.be/i)||d.match(/youtube\.com\/watch/i)?(c=/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,(c=d.match(c))&&11==c[7].length&&(f=c[7]),void 0!==f&&(a._s6=a.st.video.youTubeCode.replace("%id%",f))):d.match(/vimeo\.com/i)&&(c=/\/\/(www\.)?vimeo.com\/(\d+)($|\/)/,
(c=d.match(c))&&(f=c[2]),void 0!==f&&(a._s6=a.st.video.vimeoCode.replace("%id%",f)));a.videoObj=e(a._s6);a.ev.trigger("rsOnCreateVideoElement",[d]);a.videoObj.length&&(a._s6=e('<div class="rsVideoFrameHolder"><div class="rsPreloader"></div><div class="rsCloseVideoBtn"><div class="rsCloseVideoIcn"></div></div></div>'),a._s6.find(".rsPreloader").after(a.videoObj),b=b.hasClass("rsVideoContainer")?b:b.find(".rsVideoContainer"),a._s6.css({width:b.width(),height:b.height()}).find(".rsCloseVideoBtn").off("click.rsv").on("click.rsv",
function(b){a.stopVideo();b.preventDefault();b.stopPropagation();return false}),b.append(a._s6),a.isIPAD&&b.addClass("rsIOSVideo"),a._w1&&a.st.video.autoHideArrows&&(a._w1.addClass("rsHidden"),a._x1.addClass("rsHidden"),a._y1=!0),a._t4&&a.st.video.autoHideControlNav&&a._t4.addClass("rsHidden"),a.st.video.autoHideBlocks&&a.currSlide.animBlocks&&a.currSlide.animBlocks.addClass("rsHidden"),setTimeout(function(){a._s6.addClass("rsVideoActive")},10),a.ev.trigger("rsVideoPlay"),a._d4=!0);return!0}return!1},
stopVideo:function(){var a=this;return a._d4?(a.isIPAD&&a.slider.find(".rsCloseVideoBtn").remove(),a._w1&&a.st.video.autoHideArrows&&(a._w1.removeClass("rsHidden"),a._x1.removeClass("rsHidden"),a._y1=!1),a._t4&&a.st.video.autoHideControlNav&&a._t4.removeClass("rsHidden"),a.st.video.autoHideBlocks&&a.currSlide.animBlocks&&a.currSlide.animBlocks.removeClass("rsHidden"),setTimeout(function(){a.ev.trigger("rsOnDestroyVideoElement",[a.videoObj]);a._s6.remove()},16),a.ev.trigger("rsVideoStop"),a._d4=!1,
!0):!1}});e.rsModules.video=e.rsProto._q6})(jQuery);
$(document).ready(function(){

	/// menu

    // $(window).scroll(function(){
    //  var divOffset2 = $('.shrink-nav').offset();
    //  if(window.scrollY > divOffset2.top ){
    //     $('.main-nav').addClass('small-nav');
    //  }
    //  if(window.scrollY < divOffset2.top){
    //     $('.main-nav').removeClass('small-nav');
    //  }
    // });

	//slider
  $('#full-width-slider').royalSlider({
    arrowsNav: true,
    loop: false,
    keyboardNavEnabled: true,
    controlsInside: false,
    imageScaleMode: 'fill',
    arrowsNavAutoHide: false,
    autoScaleSlider: true, 
    autoScaleSliderWidth: 960,     
    autoScaleSliderHeight: 350,
    controlNavigation: 'bullets',
    thumbsFitInViewport: false,
    navigateByClick: true,
    startSlideId: 0,
    autoPlay: false,
    transitionType:'move',
    globalCaption: true
  });
    

});
