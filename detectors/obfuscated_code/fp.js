

var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
var __objRest$1 = (source, exclude) => {
    var target = {};
    for (var prop in source)
        if (__hasOwnProp$7.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$7)
        for (var prop of __getOwnPropSymbols$7(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$7.call(source, prop))
                target[prop] = source[prop];
        }
    return target;
};
function useMutationObserver(target, callback, options = {}) {
    const _a2 = options, { window: window2 = defaultWindow } = _a2, mutationOptions = __objRest$1(_a2, ["window"]);
    let observer;
    const isSupported = useSupported(() => window2 && "MutationObserver" in window2);
    const cleanup = () => {
        if (observer) {
            observer.disconnect();
            observer = void 0;
        }
    };
    const stopWatch = vue.watch(() => unrefElement(target), (el) => {
        cleanup();
        if (isSupported.value && window2 && el) {
            observer = new MutationObserver(callback);
            observer.observe(el, mutationOptions);
        }
    }, { immediate: true });
    const stop = () => {
        cleanup();
        stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
        isSupported,
        stop
    };
}
var SwipeDirection;
(function(SwipeDirection2) {
    SwipeDirection2["UP"] = "UP";
    SwipeDirection2["RIGHT"] = "RIGHT";
    SwipeDirection2["DOWN"] = "DOWN";
    SwipeDirection2["LEFT"] = "LEFT";
    SwipeDirection2["NONE"] = "NONE";
})(SwipeDirection || (SwipeDirection = {}));
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
            if (__propIsEnum.call(b, prop))
                __defNormalProp(a, prop, b[prop]);
        }
    return a;
};
const _TransitionPresets = {
    easeInSine: [0.12, 0, 0.39, 0],
    easeOutSine: [0.61, 1, 0.88, 1],
    easeInOutSine: [0.37, 0, 0.63, 1],
    easeInQuad: [0.11, 0, 0.5, 0],
    easeOutQuad: [0.5, 1, 0.89, 1],
    easeInOutQuad: [0.45, 0, 0.55, 1],
    easeInCubic: [0.32, 0, 0.67, 0],
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeInQuart: [0.5, 0, 0.75, 0],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1],
    easeInQuint: [0.64, 0, 0.78, 0],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeInExpo: [0.7, 0, 0.84, 0],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeInCirc: [0.55, 0, 1, 0.45],
    easeOutCirc: [0, 0.55, 0.45, 1],
    easeInOutCirc: [0.85, 0, 0.15, 1],
    easeInBack: [0.36, 0, 0.66, -0.56],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
const TransitionPresets = __spreadValues({
    linear: identity
}, _TransitionPresets);
function createEasingFunction([p0, p1, p2, p3]) {
    const a = (a1, a2) => 1 - 3 * a2 + 3 * a1;
    const b = (a1, a2) => 3 * a2 - 6 * a1;
    const c = (a1) => 3 * a1;
    const calcBezier = (t2, a1, a2) => ((a(a1, a2) * t2 + b(a1, a2)) * t2 + c(a1)) * t2;
    const getSlope = (t2, a1, a2) => 3 * a(a1, a2) * t2 * t2 + 2 * b(a1, a2) * t2 + c(a1);
    const getTforX = (x) => {
        let aGuessT = x;
        for (let i = 0; i < 4; ++i) {
            const currentSlope = getSlope(aGuessT, p0, p2);
            if (currentSlope === 0)
                return aGuessT;
            const currentX = calcBezier(aGuessT, p0, p2) - x;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    };
    return (x) => p0 === p1 && p2 === p3 ? x : calcBezier(getTforX(x), p1, p3);
}
function useTransition(source, options = {}) {
    const {
        delay = 0,
        disabled = false,
        duration = 1e3,
        onFinished = noop$1,
        onStarted = noop$1,
        transition = identity
    } = options;
    const currentTransition = vue.computed(() => {
        const t2 = vue.unref(transition);
        return isFunction$2(t2) ? t2 : createEasingFunction(t2);
    });
    const sourceValue = vue.computed(() => {
        const s = vue.unref(source);
        return isNumber$1(s) ? s : s.map(vue.unref);
    });
    const sourceVector = vue.computed(() => isNumber$1(sourceValue.value) ? [sourceValue.value] : sourceValue.value);
    const outputVector = vue.ref(sourceVector.value.slice(0));
    let currentDuration;
    let diffVector;
    let endAt;
    let startAt;
    let startVector;
    const { resume, pause } = useRafFn(() => {
        const now = Date.now();
        const progress = clamp(1 - (endAt - now) / currentDuration, 0, 1);
        outputVector.value = startVector.map((val, i) => {
            var _a2;
            return val + ((_a2 = diffVector[i]) != null ? _a2 : 0) * currentTransition.value(progress);
        });
        if (progress >= 1) {
            pause();
            onFinished();
        }
    }, { immediate: false });
    const start = () => {
        pause();
        currentDuration = vue.unref(duration);
        diffVector = outputVector.value.map((n, i) => {
            var _a2, _b;
            return ((_a2 = sourceVector.value[i]) != null ? _a2 : 0) - ((_b = outputVector.value[i]) != null ? _b : 0);
        });
        startVector = outputVector.value.slice(0);
        startAt = Date.now();
        endAt = startAt + currentDuration;
        resume();
        onStarted();
    };
    const timeout = useTimeoutFn$1(start, delay, { immediate: false });
    vue.watch(sourceVector, () => {
        if (vue.unref(disabled))
            return;
        if (vue.unref(delay) <= 0)
            start();
        else
            timeout.start();
    }, { deep: true });
    vue.watch(() => vue.unref(disabled), (v) => {
        if (v) {
            outputVector.value = sourceVector.value.slice(0);
            pause();
        }
    });
    return vue.computed(() => {
        const targetVector = vue.unref(disabled) ? sourceVector : outputVector;
        return isNumber$1(sourceValue.value) ? targetVector.value[0] : targetVector.value;
    });
}
const _hoisted_1$u = { class: "flex justify-between" };
const _hoisted_2$a = { key: 0 };
const _hoisted_3$7 = { class: "flex flex-wrap px-2" };
const _hoisted_4$5 = ["onClick", "title"];
const _hoisted_5$4 = {
    key: 0,
    class: "flex py-2 items-center justify-center"
};
const _hoisted_6$2 = {
    key: 1,
    class: "p-5"
};
const _hoisted_7$1 = {
    key: 0,
    class: "cursor-pointer px-2 py-1 flex items-center"
};
const _sfc_main$19 = /* @__PURE__ */ vue.defineComponent({
    __name: "IconPicker",
    props: {
        value: null,
        width: { default: "100%" },
        pageSize: { default: 140 },
        copy: { type: Boolean, default: false },
        mode: { default: "iconify" }
    },
    emits: ["change", "update:value"],
    setup(__props, { emit }) {
        const props2 = __props;
        const AInput = antDesignVue.Input;
        const APopover = antDesignVue.Popover;
        const APagination = antDesignVue.Pagination;
        const AEmpty = antDesignVue.Empty;
        function getIcons() {
            const data = iconsData;
            const prefix = (data == null ? void 0 : data.prefix) ?? "";
            let result = [];
            if (prefix) {
                result = ((data == null ? void 0 : data.icons) ?? []).map((item) => `${prefix}:${item}`);
            } else if (Array.isArray(iconsData)) {
                result = iconsData;
            }
            return result;
        }
        function getSvgIcons() {
            return [];
        }
        const isSvgMode = props2.mode === "svg";
        const icons = isSvgMode ? getSvgIcons() : getIcons();
        const currentSelect = vue.ref("");
        const visible = vue.ref(false);
        const currentList = vue.ref(icons);
        const prefixCls2 = "shy-icon-picker";
        const debounceHandleSearchChange = useDebounceFn$1(handleSearchChange, 100);
        const { clipboardRef, isSuccessRef } = use.useCopyToClipboard(props2.value);
        const { createMessage } = use.useMessage();
        const { getPaginationList, getTotal, setCurrentPage } = use.usePagination(
            currentList,
            props2.pageSize
        );
        vue.watchEffect(() => {
            currentSelect.value = props2.value;
        });
        vue.watch(
            () => currentSelect.value,
            (v) => {
                emit("update:value", v);
                return emit("change", v);
            }
        );
        function handlePageChange(page) {
            setCurrentPage(page);
        }
        function handleClick(icon) {
            currentSelect.value = icon;
            if (props2.copy) {
                clipboardRef.value = icon;
                if (vue.unref(isSuccessRef)) {
                    createMessage.success("复制图标成功!");
                }
            }
        }
        function handleSearchChange(e) {
            const value = e.target.value;
            if (!value) {
                setCurrentPage(1);
                currentList.value = icons;
                return;
            }
            currentList.value = icons.filter((item) => item.includes(value));
        }
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(AInput), {
                disabled: "",
                style: vue.normalizeStyle({ width: __props.width }),
                placeholder: "点击选择图标",
                class: vue.normalizeClass(prefixCls2),
                value: currentSelect.value,
                "onUpdate:value": _cache[1] || (_cache[1] = ($event) => currentSelect.value = $event)
            }, {
                addonAfter: vue.withCtx(() => [
                    vue.createVNode(vue.unref(APopover), {
                        placement: "bottomLeft",
                        trigger: "click",
                        modelValue: visible.value,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => visible.value = $event),
                        overlayClassName: `${prefixCls2}-popover`
                    }, {
                        title: vue.withCtx(() => [
                            vue.createElementVNode("div", _hoisted_1$u, [
                                vue.createVNode(vue.unref(AInput), {
                                    placeholder: "搜索图标",
                                    onChange: vue.unref(debounceHandleSearchChange),
                                    allowClear: ""
                                }, null, 8, ["onChange"])
                            ])
                        ]),
                        content: vue.withCtx(() => [
                            vue.unref(getPaginationList).length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$a, [
                                vue.createVNode(vue.unref(ScrollContainer$1), { class: "border border-solid border-t-0" }, {
                                    default: vue.withCtx(() => [
                                        vue.createElementVNode("ul", _hoisted_3$7, [
                                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(getPaginationList), (icon) => {
                                                return vue.openBlock(), vue.createElementBlock("li", {
                                                    key: icon,
                                                    class: vue.normalizeClass([currentSelect.value === icon ? "border border-primary" : "", "p-2 w-1/8 cursor-pointer mr-1 mt-1 flex justify-center items-center border border-solid hover:border-primary"]),
                                                    onClick: ($event) => handleClick(icon),
                                                    title: icon
                                                }, [
                                                    isSvgMode ? (vue.openBlock(), vue.createBlock(SvgIcon, {
                                                        key: 0,
                                                        name: icon
                                                    }, null, 8, ["name"])) : (vue.openBlock(), vue.createBlock(Icon2, {
                                                        key: 1,
                                                        icon
                                                    }, null, 8, ["icon"]))
                                                ], 10, _hoisted_4$5);
                                            }), 128))
                                        ])
                                    ]),
                                    _: 1
                                }),
                                vue.unref(getTotal) >= __props.pageSize ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$4, [
                                    vue.createVNode(vue.unref(APagination), {
                                        showLessItems: "",
                                        size: "small",
                                        pageSize: __props.pageSize,
                                        total: vue.unref(getTotal),
                                        onChange: handlePageChange
                                    }, null, 8, ["pageSize", "total"])
                                ])) : vue.createCommentVNode("", true)
                            ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_6$2, [
                                vue.createVNode(vue.unref(AEmpty))
                            ]))
                        ]),
                        default: vue.withCtx(() => [
                            isSvgMode && currentSelect.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7$1, [
                                vue.createVNode(SvgIcon, { name: currentSelect.value }, null, 8, ["name"])
                            ])) : (vue.openBlock(), vue.createBlock(Icon2, {
                                key: 1,
                                icon: currentSelect.value || "ion:apps-outline",
                                class: "cursor-pointer px-2 py-1"
                            }, null, 8, ["icon"]))
                        ]),
                        _: 1
                    }, 8, ["modelValue", "overlayClassName"])
                ]),
                _: 1
            }, 8, ["style", "value"]);
        };
    }
});
const IconPicker_vue_vue_type_style_index_0_lang = "";
function useCountdown(count) {
    const currentCount = vue.ref(count);
    const isStart = vue.ref(false);
    let timerId;
    function clear2() {
        timerId && window.clearInterval(timerId);
    }
    function stop() {
        isStart.value = false;
        clear2();
        timerId = null;
    }
    function start() {
        if (vue.unref(isStart) || !!timerId) {
            return;
        }
        isStart.value = true;
        timerId = setInterval(() => {
            if (vue.unref(currentCount) === 1) {
                stop();
                currentCount.value = count;
            } else {
                currentCount.value -= 1;
            }
        }, 1e3);
    }
    function reset2() {
        currentCount.value = count;
        stop();
    }
    function restart() {
        reset2();
        start();
    }
    tryOnUnmounted(() => {
        reset2();
    });
    return { start, reset: reset2, restart, clear: clear2, stop, currentCount, isStart };
}
const props$9 = {
    value: { type: [Object, Number, String, Array] },
    count: { type: Number, default: 60 },
    beforeStartFunc: {
        type: Function,
        default: null
    }
};
const _sfc_main$18 = vue.defineComponent({
    name: "CountButton",
    components: { AButton: antDesignVue.Button },
    props: props$9,
    setup(props2) {
        const loading = vue.ref(false);
        const { currentCount, isStart, start, reset: reset2 } = useCountdown(props2.count);
        const getButtonText = vue.computed(() => {
            return !vue.unref(isStart) ? "获取验证码" : `${currentCount.value}秒后重新获取`;
        });
        vue.watchEffect(() => {
            props2.value === void 0 && reset2();
        });
        async function handleStart() {
            const { beforeStartFunc } = props2;
            if (beforeStartFunc && utils.isFunction(beforeStartFunc)) {
                loading.value = true;
                try {
                    const canStart = await beforeStartFunc();
                    canStart && start();
                } finally {
                    loading.value = false;
                }
            } else {
                start();
            }
        }
        return { handleStart, currentCount, loading, getButtonText, isStart };
    }
});
function _sfc_render$E(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_AButton = vue.resolveComponent("AButton");
    return vue.openBlock(), vue.createBlock(_component_AButton, vue.mergeProps(_ctx.$attrs, {
        disabled: _ctx.isStart,
        onClick: _ctx.handleStart,
        loading: _ctx.loading
    }), {
        default: vue.withCtx(() => [
            vue.createTextVNode(vue.toDisplayString(_ctx.getButtonText), 1)
        ]),
        _: 1
    }, 16, ["disabled", "onClick", "loading"]);
}
const CountButton = /* @__PURE__ */ _export_sfc(_sfc_main$18, [["render", _sfc_render$E]]);
const props$8 = {
    value: { type: String },
    size: {
        type: String,
        validator: (v) => ["default", "large", "small"].includes(v)
    },
    count: { type: Number, default: 60 },
    sendCodeApi: {
        type: Function,
        default: null
    }
};
const _sfc_main$17 = vue.defineComponent({
    name: "CountDownInput",
    components: { CountButton },
    inheritAttrs: false,
    props: props$8,
    setup(props2, { attrs }) {
        const prefixCls2 = "shy-countdown-input";
        const [state] = use.useRuleFormItem(props2);
        return { prefixCls: prefixCls2, state };
    }
});
const CountdownInput_vue_vue_type_style_index_0_lang = "";
function _sfc_render$D(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CountButton = vue.resolveComponent("CountButton");
    const _component_a_input = vue.resolveComponent("a-input");
    return vue.openBlock(), vue.createBlock(_component_a_input, vue.mergeProps(_ctx.$attrs, {
        class: _ctx.prefixCls,
        size: _ctx.size,
        value: _ctx.state
    }), vue.createSlots({
        addonAfter: vue.withCtx(() => [
            vue.createVNode(_component_CountButton, {
                size: _ctx.size,
                count: _ctx.count,
                value: _ctx.state,
                beforeStartFunc: _ctx.sendCodeApi
            }, null, 8, ["size", "count", "value", "beforeStartFunc"]),
            vue.createTextVNode(" " + vue.toDisplayString(_ctx.$attrs), 1)
        ]),
        _: 2
    }, [
        vue.renderList(Object.keys(_ctx.$slots).filter((k) => k !== "addonAfter"), (item) => {
            return {
                name: item,
                fn: vue.withCtx((data) => [
                    vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                ])
            };
        })
    ]), 1040, ["class", "size", "value"]);
}
const CountdownInput = /* @__PURE__ */ _export_sfc(_sfc_main$17, [["render", _sfc_render$D]]);
const style$1 = "";
const _sfc_main$16 = /* @__PURE__ */ vue.defineComponent({
    __name: "Tinymce",
    props: {
        value: null
    },
    emits: ["change", "input"],
    setup(__props) {
        const props2 = __props;
        const [state] = use.useRuleFormItem(props2);
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(tinymce.Tinymce), {
                modelValue: vue.unref(state),
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(state) ? state.value = $event : null),
                width: "100%"
            }, null, 8, ["modelValue"]);
        };
    }
});
const _hoisted_1$t = { key: 0 };
const _hoisted_2$9 = { key: 1 };
const _hoisted_3$6 = {
    key: 1,
    class: "delete-wrapper"
};
const _hoisted_4$4 = {
    key: 0,
    class: "delete-index"
};
const _hoisted_5$3 = ["onClick"];
const _hoisted_6$1 = {
    key: 2,
    class: ""
};
const _sfc_main$15 = /* @__PURE__ */ vue.defineComponent({
    __name: "Table",
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        value: {
            type: Array,
            default: () => []
        },
        isShowAction: {
            type: Boolean,
            default: () => true
        }
    },
    emits: ["update:value", "change"],
    setup(__props, { expose, emit }) {
        const props2 = __props;
        const listFormRefs = vue.ref([]);
        const emitData = vue.ref([]);
        const [state] = use.useRuleFormItem(props2, "value", "change", emitData);
        const getColumns = vue.computed(() => {
            const indexColumn = {
                title: "序号",
                dataIndex: "index",
                customRender: ({ index: index2 }) => {
                    return `${index2 + 1}`;
                },
                minWidth: 50,
                align: "center"
            };
            return [indexColumn, ...props2.columns];
        });
        const plusClickEvent = () => {
            state.value = [{}, ...state.value];
        };
        const rowClickEvent = (index2) => {
            state.value = vue.unref(state).filter((item, i) => {
                return index2 !== i;
            });
        };
        const loadKv = () => {
            const columns = props2.columns;
            let dicData = [];
            columns.forEach(async (column) => {
                if (column == null ? void 0 : column.api) {
                    dicData = await column.api();
                    column.dicData = dicData;
                }
            });
        };
        loadKv();
        vue.watch(
            () => state.value,
            (v) => {
                emit("update:value", v);
            }
            // { immediate: true }
        );
        const validate = async () => {
            try {
                for (let formRef of listFormRefs.value) {
                    await formRef.validate();
                }
            } catch {
                throw new Error("校验失败");
            }
        };
        expose({ validate });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Table), {
                columns: vue.unref(getColumns),
                "data-source": vue.unref(state),
                pagination: false,
                bordered: "",
                size: "small",
                class: "table-children",
                align: "center"
            }, {
                headerCell: vue.withCtx(({ column }) => [
                    column.dataIndex === "index" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$t, [
                        __props.isShowAction ? (vue.openBlock(), vue.createElementBlock("div", {
                            key: 0,
                            class: "table-plus",
                            onClick: plusClickEvent
                        }, " + ")) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$9, "序号"))
                    ])) : vue.createCommentVNode("", true)
                ]),
                bodyCell: vue.withCtx(({ column, record, index: index2 }) => [
                    column.dataIndex !== "index" ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Form), {
                        key: 0,
                        model: record,
                        ref: (el) => {
                            if (el)
                                listFormRefs.value.push(el);
                        }
                    }, {
                        default: vue.withCtx(() => [
                            vue.createVNode(vue.unref(antDesignVue.FormItem), {
                                rules: (column == null ? void 0 : column.rules) || [],
                                name: column.dataIndex
                            }, {
                                default: vue.withCtx(() => [
                                    column.type === "select" ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Select), {
                                        key: 0,
                                        value: record[column.dataIndex],
                                        "onUpdate:value": ($event) => record[column.dataIndex] = $event,
                                        options: column.dicData,
                                        mode: column.mode,
                                        "max-tag-count": column.maxTagCount,
                                        "max-tag-text-length": column.maxTagTextLength
                                    }, null, 8, ["value", "onUpdate:value", "options", "mode", "max-tag-count", "max-tag-text-length"])) : column.type === "datePicker" ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.DatePicker), {
                                        key: 1,
                                        value: record[column.dataIndex],
                                        "onUpdate:value": ($event) => record[column.dataIndex] = $event,
                                        valueFormat: "YYYY-MM-DD HH:mm:ss",
                                        showTime: true
                                    }, null, 8, ["value", "onUpdate:value"])) : column.type === "number" ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.InputNumber), {
                                        key: 2,
                                        value: record[column.dataIndex],
                                        "onUpdate:value": ($event) => record[column.dataIndex] = $event,
                                        min: column.min,
                                        max: column.max,
                                        precision: column.precision ?? 2
                                    }, null, 8, ["value", "onUpdate:value", "min", "max", "precision"])) : (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Input), {
                                        key: 3,
                                        value: record[column.dataIndex],
                                        "onUpdate:value": ($event) => record[column.dataIndex] = $event,
                                        disabled: !props2.isShowAction
                                    }, null, 8, ["value", "onUpdate:value", "disabled"]))
                                ]),
                                _: 2
                            }, 1032, ["rules", "name"])
                        ]),
                        _: 2
                    }, 1032, ["model"])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$6, [
                        __props.isShowAction ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$4, vue.toDisplayString(index2 + 1), 1)) : vue.createCommentVNode("", true),
                        __props.isShowAction ? (vue.openBlock(), vue.createElementBlock("div", {
                            key: 1,
                            class: "delete-item",
                            onClick: ($event) => rowClickEvent(index2)
                        }, [
                            vue.createVNode(vue.unref(Icon2), {
                                icon: "ant-design:delete-filled",
                                color: "#fff"
                            })
                        ], 8, _hoisted_5$3)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_6$1, vue.toDisplayString(index2 + 1), 1))
                    ]))
                ]),
                _: 1
            }, 8, ["columns", "data-source"]);
        };
    }
});
const Table_vue_vue_type_style_index_0_scoped_3f633fd8_lang = "";
const Table = /* @__PURE__ */ _export_sfc(_sfc_main$15, [["__scopeId", "data-v-3f633fd8"]]);
const modal = "";
use.useI18n();
const modalProps = {
    visible: { type: Boolean },
    scrollTop: { type: Boolean, default: true },
    height: { type: Number },
    minHeight: { type: Number },
    // open drag
    draggable: { type: Boolean, default: true },
    centered: { type: Boolean },
    cancelText: { type: String, default: "取消" },
    okText: { type: String, default: "确认" },
    closeFunc: Function
};
const basicProps$6 = Object.assign({}, modalProps, {
    defaultFullscreen: { type: Boolean },
    // Can it be full screen
    canFullscreen: { type: Boolean, default: true },
    // After enabling the wrapper, the bottom can be increased in height
    wrapperFooterOffset: { type: Number, default: 0 },
    // Warm reminder message
    helpMessage: [String, Array],
    // Whether to setting wrapper
    useWrapper: { type: Boolean, default: true },
    loading: { type: Boolean },
    loadingTip: { type: String },
    /**
     * @description: Show close button
     */
    showCancelBtn: { type: Boolean, default: true },
    /**
     * @description: Show confirmation button
     */
    showOkBtn: { type: Boolean, default: true },
    wrapperProps: Object,
    afterClose: Function,
    bodyStyle: Object,
    closable: { type: Boolean, default: true },
    closeIcon: Object,
    confirmLoading: { type: Boolean },
    destroyOnClose: { type: Boolean },
    footer: Object,
    getContainer: Function,
    mask: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: false },
    keyboard: { type: Boolean, default: true },
    maskStyle: Object,
    okType: { type: String, default: "primary" },
    okButtonProps: Object,
    cancelButtonProps: Object,
    title: { type: String },
    visible: { type: Boolean },
    width: [String, Number],
    wrapClassName: { type: String },
    zIndex: { type: Number }
});
function is(val, type) {
    return toString.call(val) === `[object ${type}]`;
}
function isFunction$1(val) {
    return typeof val === "function";
}
function isObject$1(val) {
    return val !== null && is(val, "Object");
}
function isDef(val) {
    return typeof val !== "undefined";
}
function isUnDef(val) {
    return !isDef(val);
}
function isString$1(val) {
    return is(val, "String");
}
function isArray(val) {
    return val && Array.isArray(val);
}
function useTimeoutFn(handle, wait, native = false) {
    if (!isFunction$1(handle)) {
        throw new Error("handle is not Function!");
    }
    const { readyRef, stop, start } = useTimeoutRef(wait);
    if (native) {
        handle();
    } else {
        vue.watch(
            readyRef,
            (maturity) => {
                maturity && handle();
            },
            { immediate: false }
        );
    }
    return { readyRef, stop, start };
}
function useTimeoutRef(wait) {
    const readyRef = vue.ref(false);
    let timer;
    function stop() {
        readyRef.value = false;
        timer && window.clearTimeout(timer);
    }
    function start() {
        stop();
        timer = setTimeout(() => {
            readyRef.value = true;
        }, wait);
    }
    start();
    tryOnUnmounted(stop);
    return { readyRef, stop, start };
}
function useModalDragMove(context) {
    const getStyle = (dom, attr) => {
        return getComputedStyle(dom)[attr];
    };
    const drag = (wrap) => {
        if (!wrap)
            return;
        wrap.setAttribute("data-drag", vue.unref(context.draggable));
        const dialogHeaderEl = wrap.querySelector(".ant-modal-header");
        const dragDom = wrap.querySelector(".ant-modal");
        if (!dialogHeaderEl || !dragDom || !vue.unref(context.draggable))
            return;
        dialogHeaderEl.style.cursor = "move";
        dialogHeaderEl.onmousedown = (e) => {
            if (!e)
                return;
            const disX = e.clientX;
            const disY = e.clientY;
            const screenWidth = document.body.clientWidth;
            const screenHeight = document.documentElement.clientHeight;
            const dragDomWidth = dragDom.offsetWidth;
            const dragDomheight = dragDom.offsetHeight;
            const minDragDomLeft = dragDom.offsetLeft;
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
            const minDragDomTop = dragDom.offsetTop;
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
            const domLeft = getStyle(dragDom, "left");
            const domTop = getStyle(dragDom, "top");
            let styL = +domLeft;
            let styT = +domTop;
            if (domLeft.includes("%")) {
                styL = +document.body.clientWidth * (+domLeft.replace(/%/g, "") / 100);
                styT = +document.body.clientHeight * (+domTop.replace(/%/g, "") / 100);
            } else {
                styL = +domLeft.replace(/px/g, "");
                styT = +domTop.replace(/px/g, "");
            }
            document.onmousemove = function(e2) {
                let left = e2.clientX - disX;
                let top = e2.clientY - disY;
                if (-left > minDragDomLeft) {
                    left = -minDragDomLeft;
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft;
                }
                if (-top > minDragDomTop) {
                    top = -minDragDomTop;
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop;
                }
                dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    };
    const handleDrag = () => {
        const dragWraps = document.querySelectorAll(".ant-modal-wrap");
        for (const wrap of Array.from(dragWraps)) {
            if (!wrap)
                continue;
            const display = getStyle(wrap, "display");
            const draggable = wrap.getAttribute("data-drag");
            if (display !== "none") {
                if (draggable === null || vue.unref(context.destroyOnClose)) {
                    drag(wrap);
                }
            }
        }
    };
    vue.watchEffect(() => {
        if (!vue.unref(context.visible) || !vue.unref(context.draggable)) {
            return;
        }
        useTimeoutFn(() => {
            handleDrag();
        }, 30);
    });
}
const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
const LISTENER_PREFIX = /^on[A-Z]/;
function entries(obj) {
    return Object.keys(obj).map((key2) => [key2, obj[key2]]);
}
function useAttrs(params = {}) {
    const instance = vue.getCurrentInstance();
    if (!instance)
        return {};
    const {
        excludeListeners = false,
        excludeKeys = [],
        excludeDefaultKeys = true
    } = params;
    const attrs = vue.shallowRef({});
    const allExcludeKeys = excludeKeys.concat(
        excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []
    );
    instance.attrs = vue.reactive(instance.attrs);
    vue.watchEffect(() => {
        const res = entries(instance.attrs).reduce((acm, [key2, val]) => {
            if (!allExcludeKeys.includes(key2) && !(excludeListeners && LISTENER_PREFIX.test(key2))) {
                acm[key2] = val;
            }
            return acm;
        }, {});
        attrs.value = res;
    });
    return attrs;
}
function getSlot(slots, slot = "default", data) {
    if (!slots || !Reflect.has(slots, slot)) {
        return null;
    }
    if (!isFunction$1(slots[slot])) {
        console.error(`${slot} is not a function!`);
        return null;
    }
    const slotFn = slots[slot];
    if (!slotFn)
        return null;
    return slotFn(data);
}
function extendSlots(slots, excludeKeys = []) {
    const slotKeys = Object.keys(slots);
    const ret = {};
    slotKeys.map((key2) => {
        if (excludeKeys.includes(key2)) {
            return null;
        }
        ret[key2] = (data) => getSlot(slots, key2, data);
    });
    return ret;
}
function _isSlot$3(s) {
    return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const Modal$1 = /* @__PURE__ */ vue.defineComponent({
    name: "Modal",
    inheritAttrs: false,
    props: basicProps$6,
    emits: ["cancel"],
    setup(props2, {
        slots,
        emit
    }) {
        const {
            visible,
            draggable,
            destroyOnClose
        } = vue.toRefs(props2);
        const attrs = useAttrs();
        useModalDragMove({
            visible,
            destroyOnClose,
            draggable
        });
        const onCancel = (e) => {
            emit("cancel", e);
        };
        return () => {
            let _slot;
            const propsData = {
                ...vue.unref(attrs),
                ...props2,
                onCancel
            };
            return vue.createVNode(antDesignVue.Modal, propsData, _isSlot$3(_slot = extendSlots(slots)) ? _slot : {
                default: () => [_slot]
            });
        };
    }
});
function useWindowSizeFn(fn, wait = 150, options) {
    let handler = () => {
        fn();
    };
    const handleSize = useDebounceFn$1(handler, wait);
    handler = handleSize;
    const start = () => {
        if (options && options.immediate) {
            handler();
        }
        window.addEventListener("resize", handler);
    };
    const stop = () => {
        window.removeEventListener("resize", handler);
    };
    tryOnMounted(() => {
        start();
    });
    tryOnUnmounted(() => {
        stop();
    });
    return [start, stop];
}
const easeInOutQuad = (t2, b, c, d) => {
    t2 /= d / 2;
    if (t2 < 1) {
        return c / 2 * t2 * t2 + b;
    }
    t2--;
    return -c / 2 * (t2 * (t2 - 2) - 1) + b;
};
const move = (el, amount) => {
    el.scrollTop = amount;
};
const position = (el) => {
    return el.scrollTop;
};
function useScrollTo({
                         el,
                         to,
                         duration = 500,
                         callback
                     }) {
    const isActiveRef = vue.ref(false);
    const start = position(el);
    const change3 = to - start;
    const increment = 20;
    let currentTime = 0;
    duration = isUnDef(duration) ? 500 : duration;
    const animateScroll = function() {
        if (!vue.unref(isActiveRef)) {
            return;
        }
        currentTime += increment;
        const val = easeInOutQuad(currentTime, start, change3, duration);
        move(el, val);
        if (currentTime < duration && vue.unref(isActiveRef)) {
            requestAnimationFrame(animateScroll);
        } else {
            if (callback && isFunction$1(callback)) {
                callback();
            }
        }
    };
    const run = () => {
        isActiveRef.value = true;
        animateScroll();
    };
    const stop = () => {
        isActiveRef.value = false;
    };
    return { start: run, stop };
}
const _sfc_main$14 = vue.defineComponent({
    name: "ScrollContainer",
    components: { Scrollbar },
    setup() {
        const scrollbarRef = vue.ref(null);
        function scrollTo(to, duration = 500) {
            const scrollbar = vue.unref(scrollbarRef);
            if (!scrollbar) {
                return;
            }
            vue.nextTick(() => {
                const wrap = vue.unref(scrollbar.wrap);
                if (!wrap) {
                    return;
                }
                const { start } = useScrollTo({
                    el: wrap,
                    to,
                    duration
                });
                start();
            });
        }
        function getScrollWrap() {
            const scrollbar = vue.unref(scrollbarRef);
            if (!scrollbar) {
                return null;
            }
            return scrollbar.wrap;
        }
        function scrollBottom() {
            const scrollbar = vue.unref(scrollbarRef);
            if (!scrollbar) {
                return;
            }
            vue.nextTick(() => {
                const wrap = vue.unref(scrollbar.wrap);
                if (!wrap) {
                    return;
                }
                const scrollHeight = wrap.scrollHeight;
                const { start } = useScrollTo({
                    el: wrap,
                    to: scrollHeight
                });
                start();
            });
        }
        return {
            scrollbarRef,
            scrollTo,
            scrollBottom,
            getScrollWrap
        };
    }
});
const ScrollContainer_vue_vue_type_style_index_0_lang = "";
function _sfc_render$C(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Scrollbar = vue.resolveComponent("Scrollbar");
    return vue.openBlock(), vue.createBlock(_component_Scrollbar, vue.mergeProps({
        ref: "scrollbarRef",
        class: "scroll-container"
    }, _ctx.$attrs), {
        default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
    }, 16);
}
const ScrollContainer = /* @__PURE__ */ _export_sfc(_sfc_main$14, [["render", _sfc_render$C]]);
function createContext(context, key2 = Symbol(), options = {}) {
    const { readonly = true, createProvider = false, native = false } = options;
    const state = vue.reactive(context);
    const provideData = readonly ? vue.readonly(state) : state;
    !createProvider && vue.provide(key2, native ? context : provideData);
    return {
        state
    };
}
function useContext$1(key2 = Symbol(), defaultValue) {
    return vue.inject(key2, defaultValue || {});
}
const key$3 = Symbol();
function createModalContext(context) {
    return createContext(context, key$3);
}
function useModalContext() {
    return useContext$1(key$3);
}
const props$7 = {
    loading: { type: Boolean },
    useWrapper: { type: Boolean, default: true },
    modalHeaderHeight: { type: Number, default: 57 },
    modalFooterHeight: { type: Number, default: 74 },
    minHeight: { type: Number, default: 200 },
    height: { type: Number },
    footerOffset: { type: Number, default: 0 },
    visible: { type: Boolean },
    fullScreen: { type: Boolean },
    loadingTip: { type: String }
};
const _sfc_main$13 = vue.defineComponent({
    name: "ModalWrapper",
    components: { ScrollContainer },
    inheritAttrs: false,
    props: props$7,
    emits: ["height-change", "ext-height"],
    setup(props2, { emit }) {
        const wrapperRef = vue.ref(null);
        const spinRef = vue.ref(null);
        const realHeightRef = vue.ref(0);
        const minRealHeightRef = vue.ref(0);
        let realHeight = 0;
        useWindowSizeFn(setModalHeight.bind(null, false));
        useMutationObserver(
            spinRef,
            () => {
                setModalHeight();
            },
            {
                attributes: true,
                subtree: true
            }
        );
        createModalContext({
            redoModalHeight: setModalHeight
        });
        const spinStyle = vue.computed(() => {
            return {
                minHeight: `${props2.minHeight}px`,
                [props2.fullScreen ? "height" : "maxHeight"]: `${vue.unref(realHeightRef)}px`
            };
        });
        vue.watchEffect(() => {
            props2.useWrapper && setModalHeight();
        });
        vue.watch(
            () => props2.fullScreen,
            (v) => {
                setModalHeight();
                if (!v) {
                    realHeightRef.value = minRealHeightRef.value;
                } else {
                    minRealHeightRef.value = realHeightRef.value;
                }
            }
        );
        vue.onMounted(() => {
            const { modalHeaderHeight, modalFooterHeight } = props2;
            emit("ext-height", modalHeaderHeight + modalFooterHeight);
        });
        vue.onUnmounted(() => {
        });
        async function scrollTop() {
            vue.nextTick(() => {
                var _a2;
                const wrapperRefDom = vue.unref(wrapperRef);
                if (!wrapperRefDom)
                    return;
                (_a2 = wrapperRefDom == null ? void 0 : wrapperRefDom.scrollTo) == null ? void 0 : _a2.call(wrapperRefDom, 0);
            });
        }
        async function setModalHeight() {
            if (!props2.visible)
                return;
            const wrapperRefDom = vue.unref(wrapperRef);
            if (!wrapperRefDom)
                return;
            const bodyDom = wrapperRefDom.$el.parentElement;
            if (!bodyDom)
                return;
            bodyDom.style.padding = "0";
            await vue.nextTick();
            try {
                const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement;
                if (!modalDom)
                    return;
                const modalRect = getComputedStyle(modalDom).top;
                const modalTop = Number.parseInt(modalRect);
                let maxHeight = window.innerHeight - modalTop * 2 + (props2.footerOffset || 0) - props2.modalFooterHeight - props2.modalHeaderHeight;
                if (modalTop < 40) {
                    maxHeight -= 26;
                }
                await vue.nextTick();
                const spinEl = vue.unref(spinRef);
                if (!spinEl)
                    return;
                await vue.nextTick();
                realHeight = spinEl.scrollHeight;
                if (props2.fullScreen) {
                    realHeightRef.value = window.innerHeight - props2.modalFooterHeight - props2.modalHeaderHeight - 28;
                } else {
                    realHeightRef.value = props2.height ? props2.height : realHeight > maxHeight ? maxHeight : realHeight;
                }
                emit("height-change", vue.unref(realHeightRef));
            } catch (error2) {
            }
        }
        return { wrapperRef, spinRef, spinStyle, scrollTop, setModalHeight };
    }
});
const _hoisted_1$s = ["loading-tip"];
function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ScrollContainer = vue.resolveComponent("ScrollContainer");
    return vue.openBlock(), vue.createBlock(_component_ScrollContainer, { ref: "wrapperRef" }, {
        default: vue.withCtx(() => [
            vue.createElementVNode("div", {
                ref: "spinRef",
                style: vue.normalizeStyle(_ctx.spinStyle),
                "loading-tip": _ctx.loadingTip
            }, [
                vue.renderSlot(_ctx.$slots, "default")
            ], 12, _hoisted_1$s)
        ]),
        _: 3
    }, 512);
}
const ModalWrapper = /* @__PURE__ */ _export_sfc(_sfc_main$13, [["render", _sfc_render$B]]);
function getKey$1(namespace, key2) {
    if (!namespace) {
        return key2;
    }
    if (key2.startsWith(namespace)) {
        return key2;
    }
    return `${namespace}.${key2}`;
}
function useI18n(namespace) {
    const normalFn = {
        t: (key2) => {
            return getKey$1(namespace, key2);
        }
    };
    {
        return normalFn;
    }
}
const _sfc_main$12 = vue.defineComponent({
    name: "ModalClose",
    components: {
        Tooltip: antDesignVue.Tooltip,
        FullscreenExitOutlined: FullscreenExitOutlined$1,
        FullscreenOutlined: FullscreenOutlined$1,
        CloseOutlined: CloseOutlined$1
    },
    props: {
        canFullscreen: { type: Boolean, default: true },
        fullScreen: { type: Boolean }
    },
    emits: ["cancel", "fullscreen"],
    setup(props2, { emit }) {
        const prefixCls2 = "shy-basic-modal-close";
        const { t: t2 } = useI18n();
        const getClass = vue.computed(() => {
            return [
                prefixCls2,
                `${prefixCls2}--custom`,
                {
                    [`${prefixCls2}--can-full`]: props2.canFullscreen
                }
            ];
        });
        function handleCancel(e) {
            emit("cancel", e);
        }
        function handleFullScreen(e) {
            e == null ? void 0 : e.stopPropagation();
            e == null ? void 0 : e.preventDefault();
            emit("fullscreen");
        }
        return {
            t: t2,
            getClass,
            prefixCls: prefixCls2,
            handleCancel,
            handleFullScreen
        };
    }
});
const ModalClose_vue_vue_type_style_index_0_lang = "";
function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FullscreenExitOutlined = vue.resolveComponent("FullscreenExitOutlined");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    const _component_FullscreenOutlined = vue.resolveComponent("FullscreenOutlined");
    const _component_CloseOutlined = vue.resolveComponent("CloseOutlined");
    return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(_ctx.getClass)
    }, [
        _ctx.canFullscreen ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            _ctx.fullScreen ? (vue.openBlock(), vue.createBlock(_component_Tooltip, {
                key: 0,
                title: "还原",
                placement: "bottom"
            }, {
                default: vue.withCtx(() => [
                    vue.createVNode(_component_FullscreenExitOutlined, {
                        role: "full",
                        onClick: _ctx.handleFullScreen
                    }, null, 8, ["onClick"])
                ]),
                _: 1
            })) : (vue.openBlock(), vue.createBlock(_component_Tooltip, {
                key: 1,
                title: "全屏",
                placement: "bottom"
            }, {
                default: vue.withCtx(() => [
                    vue.createVNode(_component_FullscreenOutlined, {
                        role: "close",
                        onClick: _ctx.handleFullScreen
                    }, null, 8, ["onClick"])
                ]),
                _: 1
            }))
        ], 64)) : vue.createCommentVNode("", true),
        vue.createVNode(_component_Tooltip, {
            title: "关闭",
            placement: "bottom"
        }, {
            default: vue.withCtx(() => [
                vue.createVNode(_component_CloseOutlined, { onClick: _ctx.handleCancel }, null, 8, ["onClick"])
            ]),
            _: 1
        })
    ], 2);
}
const ModalClose = /* @__PURE__ */ _export_sfc(_sfc_main$12, [["render", _sfc_render$A]]);
const _sfc_main$11 = vue.defineComponent({
    name: "BasicModalFooter",
    props: basicProps$6,
    emits: ["ok", "cancel"],
    setup(_, { emit }) {
        function handleOk(e) {
            emit("ok", e);
        }
        function handleCancel(e) {
            emit("cancel", e);
        }
        return { handleOk, handleCancel };
    }
});
function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_a_button = vue.resolveComponent("a-button");
    return vue.openBlock(), vue.createElementBlock("div", null, [
        vue.renderSlot(_ctx.$slots, "insertFooter"),
        _ctx.showCancelBtn ? (vue.openBlock(), vue.createBlock(_component_a_button, vue.mergeProps({ key: 0 }, _ctx.cancelButtonProps, { onClick: _ctx.handleCancel }), {
            default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(_ctx.cancelText), 1)
            ]),
            _: 1
        }, 16, ["onClick"])) : vue.createCommentVNode("", true),
        vue.renderSlot(_ctx.$slots, "centerFooter"),
        _ctx.showOkBtn ? (vue.openBlock(), vue.createBlock(_component_a_button, vue.mergeProps({
            key: 1,
            type: _ctx.okType,
            onClick: _ctx.handleOk,
            loading: _ctx.confirmLoading
        }, _ctx.okButtonProps), {
            default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(_ctx.okText), 1)
            ]),
            _: 1
        }, 16, ["type", "onClick", "loading"])) : vue.createCommentVNode("", true),
        vue.renderSlot(_ctx.$slots, "appendFooter")
    ]);
}
const ModalFooter = /* @__PURE__ */ _export_sfc(_sfc_main$11, [["render", _sfc_render$z]]);
function deepMerge(src = {}, target = {}) {
    let key2;
    const res = cloneDeep(src);
    for (key2 in target) {
        res[key2] = isObject$1(res[key2]) ? deepMerge(res[key2], target[key2]) : res[key2] = target[key2];
    }
    return res;
}
function getPopupContainer(node) {
    return (node == null ? void 0 : node.parentNode) ?? document.body;
}
function useContext(key2 = Symbol(), defaultValue) {
    return vue.inject(key2, defaultValue || {});
}
const key$2 = Symbol();
function useAppProviderContext() {
    return useContext(key$2);
}
function useDesign(scope) {
    const values = useAppProviderContext();
    return {
        // prefixCls: computed(() => `${values.prefixCls}-${scope}`),
        prefixCls: `${values.prefixCls}-${scope}`,
        prefixVar: values.prefixCls
        // style,
    };
}
const props$6 = {
    /**
     * Help text max-width
     * @default: 600px
     */
    maxWidth: {
        type: String,
        default: "600px"
    },
    /**
     * Whether to display the serial number
     * @default: false
     */
    showIndex: {
        type: Boolean
    },
    /**
     * Help text font color
     * @default: #ffffff
     */
    color: {
        type: String,
        default: "#ffffff"
    },
    /**
     * Help text font size
     * @default: 14px
     */
    fontSize: {
        type: String,
        default: "14px"
    },
    /**
     * Help text list
     */
    placement: {
        type: String,
        default: "right"
    },
    /**
     * Help text list
     */
    text: {
        type: [Array, String]
    }
};
const _sfc_main$10 = /* @__PURE__ */ vue.defineComponent({
    name: "BasicHelp",
    components: {
        Tooltip: antDesignVue.Tooltip
    },
    props: props$6,
    setup(props2, {
        slots
    }) {
        const {
            prefixCls: prefixCls2
        } = useDesign("basic-help");
        const getTooltipStyle = vue.computed(() => ({
            color: props2.color,
            fontSize: props2.fontSize
        }));
        const getOverlayStyle = vue.computed(() => ({
            maxWidth: props2.maxWidth
        }));
        function renderTitle() {
            const textList = props2.text;
            if (isString$1(textList)) {
                return vue.createVNode("p", null, [textList]);
            }
            if (isArray(textList)) {
                return textList.map((text, index2) => {
                    return vue.createVNode("p", {
                        "key": text
                    }, [vue.createVNode(vue.Fragment, null, [props2.showIndex ? `${index2 + 1}. ` : "", text])]);
                });
            }
            return null;
        }
        return () => {
            return vue.createVNode(antDesignVue.Tooltip, {
                "overlayClassName": `${prefixCls2}__wrap`,
                "title": vue.createVNode("div", {
                    "style": vue.unref(getTooltipStyle)
                }, [renderTitle()]),
                "autoAdjustOverflow": true,
                "overlayStyle": vue.unref(getOverlayStyle),
                "placement": props2.placement,
                "getPopupContainer": () => getPopupContainer()
            }, {
                default: () => [vue.createVNode("span", {
                    "class": prefixCls2
                }, [getSlot(slots) || vue.createVNode(InfoCircleOutlined$1, null, null)])]
            });
        };
    }
});
const BasicHelp_vue_vue_type_style_index_0_lang = "";
const _sfc_main$$ = /* @__PURE__ */ vue.defineComponent({
    __name: "BasicTitle",
    props: {
        /**
         * Help text list or string
         * @default: ''
         */
        helpMessage: {
            type: [String, Array],
            default: ""
        },
        /**
         * Whether the color block on the left side of the title
         * @default: false
         */
        span: { type: Boolean },
        /**
         * Whether to default the text, that is, not bold
         * @default: false
         */
        normal: { type: Boolean }
    },
    setup(__props) {
        const props2 = __props;
        const prefixCls2 = "shy-basic-title";
        const slots = vue.useSlots();
        const getClass = vue.computed(() => [
            prefixCls2,
            { [`${prefixCls2}-show-span`]: props2.span && slots.default },
            { [`${prefixCls2}-normal`]: props2.normal }
        ]);
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("span", {
                class: vue.normalizeClass(vue.unref(getClass))
            }, [
                vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
                __props.helpMessage ? (vue.openBlock(), vue.createBlock(_sfc_main$10, {
                    key: 0,
                    class: vue.normalizeClass(`${prefixCls2}-help`),
                    text: __props.helpMessage
                }, null, 8, ["class", "text"])) : vue.createCommentVNode("", true)
            ], 2);
        };
    }
});
const BasicTitle_vue_vue_type_style_index_0_scoped_fdc837af_lang = "";
const BasicTitle = /* @__PURE__ */ _export_sfc(_sfc_main$$, [["__scopeId", "data-v-fdc837af"]]);
const _sfc_main$_ = vue.defineComponent({
    name: "BasicModalHeader",
    components: { BasicTitle },
    props: {
        helpMessage: {
            type: [String, Array]
        },
        title: { type: String }
    },
    emits: ["dblclick"]
});
function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BasicTitle = vue.resolveComponent("BasicTitle");
    return vue.openBlock(), vue.createBlock(_component_BasicTitle, { helpMessage: _ctx.helpMessage }, {
        default: vue.withCtx(() => [
            vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
        ]),
        _: 1
    }, 8, ["helpMessage"]);
}
const ModalHeader = /* @__PURE__ */ _export_sfc(_sfc_main$_, [["render", _sfc_render$y]]);
function useFullScreen(context) {
    const fullScreenRef = vue.ref(false);
    const getWrapClassName = vue.computed(() => {
        const clsName = vue.unref(context.wrapClassName) || "";
        return vue.unref(fullScreenRef) ? `fullscreen-modal ${clsName} ` : vue.unref(clsName);
    });
    function handleFullScreen(e) {
        e && e.stopPropagation();
        fullScreenRef.value = !vue.unref(fullScreenRef);
    }
    return { getWrapClassName, handleFullScreen, fullScreenRef };
}
const _sfc_main$Z = vue.defineComponent({
    name: "BasicModal",
    components: { Modal: Modal$1, ModalWrapper, ModalClose, ModalFooter, ModalHeader },
    inheritAttrs: false,
    props: basicProps$6,
    emits: [
        "visible-change",
        "height-change",
        "cancel",
        "ok",
        "register",
        "update:visible"
    ],
    setup(props2, { emit, attrs }) {
        const visibleRef = vue.ref(false);
        const propsRef = vue.ref(null);
        const modalWrapperRef = vue.ref(null);
        const prefixCls2 = "shy-basic-modal";
        const extHeightRef = vue.ref(0);
        const modalMethods = {
            setModalProps,
            emitVisible: void 0,
            redoModalHeight: () => {
                vue.nextTick(() => {
                    if (vue.unref(modalWrapperRef)) {
                        vue.unref(modalWrapperRef).setModalHeight();
                    }
                });
            }
        };
        const instance = vue.getCurrentInstance();
        if (instance) {
            emit("register", modalMethods, instance.uid);
        }
        const getMergeProps = vue.computed(() => {
            return {
                ...props2,
                ...vue.unref(propsRef)
            };
        });
        const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen(
            {
                modalWrapperRef,
                extHeightRef,
                wrapClassName: vue.toRef(getMergeProps.value, "wrapClassName")
            }
        );
        const getProps = vue.computed(() => {
            const opt = {
                ...vue.unref(getMergeProps),
                visible: vue.unref(visibleRef),
                okButtonProps: void 0,
                cancelButtonProps: void 0,
                title: void 0
            };
            return {
                ...opt,
                wrapClassName: vue.unref(getWrapClassName)
            };
        });
        const getBindValue = vue.computed(() => {
            const attr = {
                ...attrs,
                ...vue.unref(getMergeProps),
                visible: vue.unref(visibleRef),
                wrapClassName: vue.unref(getWrapClassName)
            };
            if (vue.unref(fullScreenRef)) {
                return omit$1(attr, ["height", "title"]);
            }
            return omit$1(attr, "title");
        });
        const getWrapperHeight = vue.computed(() => {
            if (vue.unref(fullScreenRef))
                return void 0;
            return vue.unref(getProps).height;
        });
        vue.watchEffect(() => {
            visibleRef.value = !!props2.visible;
            fullScreenRef.value = !!props2.defaultFullscreen;
        });
        vue.watch(
            () => vue.unref(visibleRef),
            (v) => {
                emit("visible-change", v);
                emit("update:visible", v);
                vue.nextTick(() => {
                    if (props2.scrollTop && v && vue.unref(modalWrapperRef)) {
                        vue.unref(modalWrapperRef).scrollTop();
                    }
                });
            },
            {
                immediate: false
            }
        );
        async function handleCancel(e) {
            var _a2, _b;
            e == null ? void 0 : e.stopPropagation();
            if ((_b = (_a2 = e.target) == null ? void 0 : _a2.classList) == null ? void 0 : _b.contains(
                prefixCls2 + "-close--custom"
            ))
                return;
            if (props2.closeFunc && isFunction$1(props2.closeFunc)) {
                const isClose = await props2.closeFunc();
                visibleRef.value = !isClose;
                return;
            }
            visibleRef.value = false;
            emit("cancel", e);
        }
        function setModalProps(props22) {
            propsRef.value = deepMerge(vue.unref(propsRef) || {}, props22);
            if (Reflect.has(props22, "visible")) {
                visibleRef.value = !!props22.visible;
            }
            if (Reflect.has(props22, "defaultFullscreen")) {
                fullScreenRef.value = !!props22.defaultFullscreen;
            }
        }
        function handleOk(e) {
            emit("ok", e);
        }
        function handleHeightChange(height) {
            emit("height-change", height);
        }
        function handleExtHeight(height) {
            extHeightRef.value = height;
        }
        function handleTitleDbClick(e) {
            if (!props2.canFullscreen)
                return;
            e.stopPropagation();
            handleFullScreen(e);
        }
        return {
            handleCancel,
            getBindValue,
            getProps,
            handleFullScreen,
            fullScreenRef,
            getMergeProps,
            handleOk,
            visibleRef,
            omit: omit$1,
            modalWrapperRef,
            handleExtHeight,
            handleHeightChange,
            handleTitleDbClick,
            getWrapperHeight
        };
    }
});
function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ModalClose = vue.resolveComponent("ModalClose");
    const _component_ModalHeader = vue.resolveComponent("ModalHeader");
    const _component_ModalFooter = vue.resolveComponent("ModalFooter");
    const _component_ModalWrapper = vue.resolveComponent("ModalWrapper");
    const _component_Modal = vue.resolveComponent("Modal");
    return vue.openBlock(), vue.createBlock(_component_Modal, vue.mergeProps({ class: "modal-wrapper" }, _ctx.getBindValue, { onCancel: _ctx.handleCancel }), vue.createSlots({
        default: vue.withCtx(() => [
            vue.createVNode(_component_ModalWrapper, vue.mergeProps(
                {
                    useWrapper: _ctx.getProps.useWrapper,
                    footerOffset: _ctx.wrapperFooterOffset,
                    fullScreen: _ctx.fullScreenRef,
                    ref: "modalWrapperRef",
                    loading: _ctx.getProps.loading,
                    "loading-tip": _ctx.getProps.loadingTip,
                    minHeight: _ctx.getProps.minHeight,
                    height: _ctx.getWrapperHeight,
                    visible: _ctx.visibleRef,
                    modalFooterHeight: _ctx.footer !== void 0 && !_ctx.footer ? 0 : void 0
                },
                _ctx.omit(_ctx.getProps.wrapperProps, "visible", "height", "modalFooterHeight"),
                {
                    onExtHeight: _ctx.handleExtHeight,
                    onHeightChange: _ctx.handleHeightChange
                }
            ), {
                default: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
            }, 16, ["useWrapper", "footerOffset", "fullScreen", "loading", "loading-tip", "minHeight", "height", "visible", "modalFooterHeight", "onExtHeight", "onHeightChange"])
        ]),
        _: 2
    }, [
        !_ctx.$slots.closeIcon ? {
            name: "closeIcon",
            fn: vue.withCtx(() => [
                vue.createVNode(_component_ModalClose, {
                    canFullscreen: _ctx.getProps.canFullscreen,
                    fullScreen: _ctx.fullScreenRef,
                    onCancel: _ctx.handleCancel,
                    onFullscreen: _ctx.handleFullScreen
                }, null, 8, ["canFullscreen", "fullScreen", "onCancel", "onFullscreen"])
            ]),
            key: "0"
        } : void 0,
        !_ctx.$slots.title ? {
            name: "title",
            fn: vue.withCtx(() => [
                vue.createVNode(_component_ModalHeader, {
                    helpMessage: _ctx.getProps.helpMessage,
                    title: _ctx.getMergeProps.title,
                    onDblclick: _ctx.handleTitleDbClick
                }, null, 8, ["helpMessage", "title", "onDblclick"])
            ]),
            key: "1"
        } : void 0,
        !_ctx.$slots.footer ? {
            name: "footer",
            fn: vue.withCtx(() => [
                vue.createVNode(_component_ModalFooter, vue.mergeProps(_ctx.getBindValue, {
                    onOk: _ctx.handleOk,
                    onCancel: _ctx.handleCancel
                }), vue.createSlots({ _: 2 }, [
                    vue.renderList(Object.keys(_ctx.$slots), (item) => {
                        return {
                            name: item,
                            fn: vue.withCtx((data) => [
                                vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                            ])
                        };
                    })
                ]), 1040, ["onOk", "onCancel"])
            ]),
            key: "2"
        } : void 0,
        vue.renderList(Object.keys(_ctx.omit(_ctx.$slots, "default")), (item) => {
            return {
                name: item,
                fn: vue.withCtx((data) => [
                    vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                ])
            };
        })
    ]), 1040, ["onCancel"]);
}
const basicModal = /* @__PURE__ */ _export_sfc(_sfc_main$Z, [["render", _sfc_render$x]]);
const projectName = {}.VITE_GLOB_APP_TITLE;
function error(message) {
    throw new Error(`[${projectName} error]:${message}`);
}
const dataTransfer = vue.reactive({});
const visibleData$1 = vue.reactive({});
function useModal() {
    const modal2 = vue.ref(null);
    const loaded = vue.ref(false);
    const uid = vue.ref("");
    function register(modalMethod, uuid) {
        if (!vue.getCurrentInstance()) {
            throw new Error(
                "useModal() can only be used inside setup() or functional components!"
            );
        }
        uid.value = uuid;
        vue.onUnmounted(() => {
            modal2.value = null;
            loaded.value = false;
            dataTransfer[vue.unref(uid)] = null;
        });
        if (vue.unref(loaded) && modalMethod === vue.unref(modal2))
            return;
        modal2.value = modalMethod;
        loaded.value = true;
        modalMethod.emitVisible = (visible, uid2) => {
            visibleData$1[uid2] = visible;
        };
    }
    const getInstance = () => {
        const instance = vue.unref(modal2);
        if (!instance) {
            error("useModal instance is undefined!");
        }
        return instance;
    };
    const methods2 = {
        setModalProps: (props2) => {
            var _a2;
            (_a2 = getInstance()) == null ? void 0 : _a2.setModalProps(props2);
        },
        getVisible: vue.computed(() => {
            return visibleData$1[~~vue.unref(uid)];
        }),
        redoModalHeight: () => {
            var _a2, _b;
            (_b = (_a2 = getInstance()) == null ? void 0 : _a2.redoModalHeight) == null ? void 0 : _b.call(_a2);
        },
        openModal: (visible = true, data, openOnSet = true) => {
            var _a2;
            (_a2 = getInstance()) == null ? void 0 : _a2.setModalProps({
                visible
            });
            if (!data)
                return;
            const id = vue.unref(uid);
            if (openOnSet) {
                dataTransfer[id] = null;
                dataTransfer[id] = vue.toRaw(data);
                return;
            }
            const equal = isEqual(vue.toRaw(dataTransfer[id]), vue.toRaw(data));
            if (!equal) {
                dataTransfer[id] = vue.toRaw(data);
            }
        },
        closeModal: () => {
            var _a2;
            (_a2 = getInstance()) == null ? void 0 : _a2.setModalProps({ visible: false });
        }
    };
    return [register, methods2];
}
const useModalInner = (callbackFn) => {
    const modalInstanceRef = vue.ref(null);
    const currentInstance = vue.getCurrentInstance();
    const uidRef = vue.ref("");
    const getInstance = () => {
        const instance = vue.unref(modalInstanceRef);
        if (!instance) {
            error("useModalInner instance is undefined!");
        }
        return instance;
    };
    const register = (modalInstance, uuid) => {
        tryOnUnmounted(() => {
            modalInstanceRef.value = null;
        });
        uidRef.value = uuid;
        modalInstanceRef.value = modalInstance;
        currentInstance == null ? void 0 : currentInstance.emit("register", modalInstance, uuid);
    };
    vue.watchEffect(() => {
        const data = dataTransfer[vue.unref(uidRef)];
        if (!data)
            return;
        if (!callbackFn || !isFunction$1(callbackFn))
            return;
        vue.nextTick(() => {
            callbackFn(data);
        });
    });
    return [
        register,
        {
            changeLoading: (loading = true) => {
                var _a2;
                (_a2 = getInstance()) == null ? void 0 : _a2.setModalProps({ loading });
            },
            getVisible: vue.computed(() => {
                return visibleData$1[~~vue.unref(uidRef)];
            }),
            changeOkLoading: (loading = true) => {
                var _a2;
                (_a2 = getInstance()) == null ? void 0 : _a2.setModalProps({ confirmLoading: loading });
            },
            closeModal: () => {
                var _a2;
                (_a2 = getInstance()) == null ? void 0 : _a2.setModalProps({ visible: false });
            },
            setModalProps: (props2) => {
                var _a2;
                (_a2 = getInstance()) == null ? void 0 : _a2.setModalProps(props2);
            },
            redoModalHeight: () => {
                var _a2;
                const callRedo = (_a2 = getInstance()) == null ? void 0 : _a2.redoModalHeight;
                callRedo && callRedo();
            }
        }
    ];
};
const BasicModal = utils.withInstall(basicModal);
const basicProps$5 = {
    listType: {
        type: String,
        default: "picture-card"
    },
    helpText: {
        type: String,
        default: ""
    },
    // 文件最大多少MB
    maxSize: {
        type: Number,
        default: 2
    },
    // 最大数量的文件，Infinity不限制
    maxNumber: {
        type: Number,
        default: 1
    },
    // 根据后缀，或者其他
    accept: {
        type: Array,
        default: () => []
    },
    multiple: {
        type: Boolean,
        default: false
    },
    uploadParams: {
        type: Object,
        default: () => ({})
    },
    api: {
        type: Function,
        default: null,
        required: true
    },
    name: {
        type: String,
        default: "file"
    },
    filename: {
        type: String,
        default: null
    },
    fileListOpenDrag: {
        type: Boolean,
        default: true
    },
    fileListDragOptions: {
        type: Object,
        default: () => ({})
    }
};
const uploadContainerProps = {
    value: {
        type: Array,
        default: () => []
    },
    ...basicProps$5,
    showPreviewNumber: {
        type: Boolean,
        default: true
    },
    emptyHidePreview: {
        type: Boolean,
        default: false
    }
};
const previewProps = {
    value: {
        type: Array,
        default: () => []
    }
};
const fileListProps = {
    columns: {
        type: Array,
        default: null
    },
    actionColumn: {
        type: Object,
        default: null
    },
    dataSource: {
        type: Array,
        default: null
    },
    openDrag: {
        type: Boolean,
        default: false
    },
    dragOptions: {
        type: Object,
        default: () => ({})
    }
};
use.useI18n();
function useUploadType({
                           acceptRef,
                           helpTextRef,
                           maxNumberRef,
                           maxSizeRef
                       }) {
    const getAccept = vue.computed(() => {
        const accept = vue.unref(acceptRef);
        if (accept && accept.length > 0) {
            return accept;
        }
        return [];
    });
    const getStringAccept = vue.computed(() => {
        return vue.unref(getAccept).map((item) => {
            if (item.indexOf("/") > 0 || item.startsWith(".")) {
                return item;
            } else {
                return `.${item}`;
            }
        }).join(",");
    });
    const getHelpText = vue.computed(() => {
        const helpText = vue.unref(helpTextRef);
        if (helpText) {
            return helpText;
        }
        const helpTexts = [];
        const accept = vue.unref(acceptRef);
        if (accept.length > 0) {
            helpTexts.push(`支持${accept}格式`);
        }
        const maxSize = vue.unref(maxSizeRef);
        if (maxSize) {
            helpTexts.push(`单个文件不超过${maxSize}MB`);
        }
        const maxNumber = vue.unref(maxNumberRef);
        if (maxNumber && maxNumber !== Infinity) {
            helpTexts.push(`最多只能上传${maxNumber}个文件`);
        }
        return helpTexts.join("，");
    });
    return { getAccept, getStringAccept, getHelpText };
}
var UploadResultStatus = /* @__PURE__ */ ((UploadResultStatus2) => {
    UploadResultStatus2["DONE"] = "done";
    UploadResultStatus2["SUCCESS"] = "success";
    UploadResultStatus2["ERROR"] = "error";
    UploadResultStatus2["UPLOADING"] = "uploading";
    return UploadResultStatus2;
})(UploadResultStatus || {});
function checkImgType(file) {
    return isImgTypeByName(file.name);
}
function isImgTypeByName(name) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
}
function getBase64WithFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ result: reader.result, file });
        reader.onerror = (error2) => reject(error2);
    });
}
const validColors = ["error", "warning", "success", ""];
const buttonProps = {
    color: {
        type: String,
        validator: (v) => validColors.includes(v),
        default: ""
    },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    /**
     * Text before icon.
     */
    preIcon: { type: String },
    /**
     * Text after icon.
     */
    postIcon: { type: String },
    /**
     * preIcon and postIcon icon size.
     * @default: 14
     */
    iconSize: { type: Number, default: 14 },
    onClick: { type: Function, default: null }
};
const __default__$4 = vue.defineComponent({
    name: "AButton",
    extends: antDesignVue.Button,
    inheritAttrs: false
});
const _sfc_main$Y = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: buttonProps,
    setup(__props) {
        const props2 = __props;
        const attrs = use.useAttrs({ excludeDefaultKeys: false });
        const getButtonClass = vue.computed(() => {
            const { color, disabled } = props2;
            return [
                {
                    [`ant-btn-${color}`]: !!color,
                    [`is-disabled`]: disabled
                }
            ];
        });
        const getBindValue = vue.computed(() => ({ ...vue.unref(attrs), ...props2 }));
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Button), vue.mergeProps(vue.unref(getBindValue), {
                class: vue.unref(getButtonClass),
                onClick: props2.onClick
            }), {
                default: vue.withCtx((data) => [
                    props2.preIcon ? (vue.openBlock(), vue.createBlock(vue.unref(Icon2), {
                        key: 0,
                        icon: props2.preIcon,
                        size: props2.iconSize
                    }, null, 8, ["icon", "size"])) : vue.createCommentVNode("", true),
                    vue.renderSlot(_ctx.$slots, "default", vue.normalizeProps(vue.guardReactiveProps(data || {}))),
                    props2.postIcon ? (vue.openBlock(), vue.createBlock(vue.unref(Icon2), {
                        key: 1,
                        icon: props2.postIcon,
                        size: props2.iconSize
                    }, null, 8, ["icon", "size"])) : vue.createCommentVNode("", true)
                ]),
                _: 3
            }, 16, ["class", "onClick"]);
        };
    }
});
const props$5 = {
    /**
     * Whether to enable the drop-down menu
     * @default: true
     */
    enable: {
        type: Boolean,
        default: true
    }
};
const _sfc_main$X = vue.defineComponent({
    name: "PopButton",
    inheritAttrs: false,
    props: props$5,
    setup(props2, { slots }) {
        const attrs = use.useAttrs();
        const getBindValues = vue.computed(() => {
            return Object.assign(
                {
                    okText: "确定",
                    cancelText: "取消"
                },
                { ...props2, ...vue.unref(attrs) }
            );
        });
        return () => {
            const bindValues = omit$1(vue.unref(getBindValues), "icon");
            const btnBind = omit$1(bindValues, "title");
            if (btnBind.disabled)
                btnBind.color = "";
            const Button2 = vue.h(_sfc_main$Y, btnBind, utils.extendSlots(slots));
            if (!props2.enable) {
                return Button2;
            }
            return vue.h(antDesignVue.Popconfirm, bindValues, { default: () => Button2 });
        };
    }
});
const Button = utils.withInstall(_sfc_main$Y);
const _hoisted_1$r = { class: "ml-1" };
const _hoisted_2$8 = { class: "ml-1" };
const _sfc_main$W = /* @__PURE__ */ vue.defineComponent({
    __name: "Dropdown",
    props: {
        popconfirm: Boolean,
        /**
         * the trigger mode which executes the drop-down action
         * @default ['hover']
         * @type string[]
         */
        trigger: {
            type: [Array],
            default: () => {
                return ["contextmenu"];
            }
        },
        dropMenuList: {
            type: Array,
            default: () => []
        },
        selectedKeys: {
            type: Array,
            default: () => []
        }
    },
    emits: ["menuEvent"],
    setup(__props, { emit }) {
        const props2 = __props;
        const ADropdown = antDesignVue.Dropdown;
        const AMenu = antDesignVue.Menu;
        const AMenuItem = antDesignVue.Menu.Item;
        const AMenuDivider = antDesignVue.Menu.Divider;
        const APopconfirm = antDesignVue.Popconfirm;
        function handleClickMenu(item) {
            var _a2;
            const { event } = item;
            const menu = props2.dropMenuList.find((item2) => `${item2.event}` === `${event}`);
            emit("menuEvent", menu);
            (_a2 = item.onClick) == null ? void 0 : _a2.call(item);
        }
        const getPopConfirmAttrs = vue.computed(() => {
            return (attrs) => {
                const originAttrs = omit$1(attrs, ["confirm", "cancel", "icon"]);
                if (!attrs.onConfirm && attrs.confirm && utils.isFunction(attrs.confirm))
                    originAttrs["onConfirm"] = attrs.confirm;
                if (!attrs.onCancel && attrs.cancel && utils.isFunction(attrs.cancel))
                    originAttrs["onCancel"] = attrs.cancel;
                return originAttrs;
            };
        });
        const getAttr = (key2) => ({ key: key2 });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(ADropdown), vue.mergeProps({ trigger: __props.trigger }, _ctx.$attrs), {
                overlay: vue.withCtx(() => [
                    vue.createVNode(vue.unref(AMenu), { selectedKeys: __props.selectedKeys }, {
                        default: vue.withCtx(() => [
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.dropMenuList, (item) => {
                                return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                                    key: `${item.event}`
                                }, [
                                    vue.createVNode(vue.unref(AMenuItem), vue.mergeProps(getAttr(item.event), {
                                        onClick: ($event) => handleClickMenu(item),
                                        disabled: item.disabled
                                    }), {
                                        default: vue.withCtx(() => [
                                            __props.popconfirm && item.popConfirm ? (vue.openBlock(), vue.createBlock(vue.unref(APopconfirm), vue.normalizeProps(vue.mergeProps({ key: 0 }, vue.unref(getPopConfirmAttrs)(item.popConfirm))), vue.createSlots({
                                                default: vue.withCtx(() => [
                                                    vue.createElementVNode("div", null, [
                                                        item.icon ? (vue.openBlock(), vue.createBlock(vue.unref(Icon2), {
                                                            key: 0,
                                                            icon: item.icon
                                                        }, null, 8, ["icon"])) : vue.createCommentVNode("", true),
                                                        vue.createElementVNode("span", _hoisted_1$r, vue.toDisplayString(item.text), 1)
                                                    ])
                                                ]),
                                                _: 2
                                            }, [
                                                item.popConfirm.icon ? {
                                                    name: "icon",
                                                    fn: vue.withCtx(() => [
                                                        vue.createVNode(vue.unref(Icon2), {
                                                            icon: item.popConfirm.icon
                                                        }, null, 8, ["icon"])
                                                    ]),
                                                    key: "0"
                                                } : void 0
                                            ]), 1040)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                                                item.icon ? (vue.openBlock(), vue.createBlock(vue.unref(Icon2), {
                                                    key: 0,
                                                    icon: item.icon
                                                }, null, 8, ["icon"])) : vue.createCommentVNode("", true),
                                                vue.createElementVNode("span", _hoisted_2$8, vue.toDisplayString(item.text), 1)
                                            ], 64))
                                        ]),
                                        _: 2
                                    }, 1040, ["onClick", "disabled"]),
                                    item.divider ? (vue.openBlock(), vue.createBlock(vue.unref(AMenuDivider), {
                                        key: `d-${item.event}`
                                    })) : vue.createCommentVNode("", true)
                                ], 64);
                            }), 128))
                        ]),
                        _: 1
                    }, 8, ["selectedKeys"])
                ]),
                default: vue.withCtx(() => [
                    vue.createElementVNode("span", null, [
                        vue.renderSlot(_ctx.$slots, "default")
                    ])
                ]),
                _: 3
            }, 16, ["trigger"]);
        };
    }
});
const key$1 = Symbol("basic-table");
function createTableContext(instance) {
    vue.provide(key$1, instance);
}
function useTableContext() {
    return vue.inject(key$1);
}
const componentSetting = {
    // basic-table setting
    table: {
        // Form interface request general configuration
        // support xxx.xxx.xxx
        fetchSetting: {
            // The field name of the current page passed to the background
            pageField: "current",
            // The number field name of each page displayed in the background
            sizeField: "size",
            // Field name of the form data returned by the interface
            listField: "records",
            // Total number of tables returned by the interface field name
            totalField: "total"
        },
        // Number of pages that can be selected
        pageSizeOptions: ["10", "50", "80", "100"],
        // Default display quantity on one page
        defaultPageSize: 10,
        // Default Size
        defaultSize: "middle",
        // Custom general sort function
        defaultSortFn: (sortInfo) => {
            const { field, order } = sortInfo;
            if (field && order) {
                return {
                    // The sort field passed to the backend you
                    sort: field,
                    // Sorting method passed to the background asc/desc
                    order: order === "ascend" ? "asc" : "desc"
                };
            } else {
                return {};
            }
        },
        // Custom general filter function
        defaultFilterFn: (data) => {
            return data;
        }
    },
    // scrollbar setting
    scrollbar: {
        // Whether to use native scroll bar
        // After opening, the menu, modal, drawer will change the pop-up scroll bar to native
        native: false
    },
    tree: {
        searchToolbar: false
    }
};
const { table } = componentSetting;
const {
    pageSizeOptions,
    defaultPageSize,
    fetchSetting,
    defaultSize,
    defaultSortFn,
    defaultFilterFn
} = table;
const ROW_KEY = "key";
const PAGE_SIZE_OPTIONS = pageSizeOptions;
const PAGE_SIZE = defaultPageSize;
const FETCH_SETTING = fetchSetting;
const DEFAULT_SIZE = defaultSize;
const DEFAULT_SORT_FN = defaultSortFn;
const DEFAULT_FILTER_FN = defaultFilterFn;
let DEFAULT_ALIGN = "left";
const INDEX_COLUMN_FLAG = "INDEX";
const ACTION_COLUMN_FLAG = "ACTION";
const ACTION_COLUMN_WIDTH = 160;
const setConstConfig = (config) => {
    DEFAULT_ALIGN = config.align;
};
const __default__$3 = {
    name: "TableAction"
};
const _sfc_main$V = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: {
        actions: {
            type: Array,
            default: null
        },
        dropDownActions: {
            type: Array,
            default: null
        },
        divider: {
            type: Boolean,
            default: true
        },
        outside: {
            type: Boolean
        },
        stopButtonPropagation: {
            type: Boolean,
            default: false
        },
        showCount: {
            type: Number,
            default: () => 3
        }
    },
    setup(__props) {
        const props2 = __props;
        const { prefixCls: prefixCls2 } = use.useDesign("basic-table-action");
        let table2 = {};
        if (!props2.outside) {
            table2 = useTableContext();
        }
        function isIfShow(action) {
            const ifShow = action.ifShow;
            let isIfShow2 = true;
            if (utils.isBoolean(ifShow)) {
                isIfShow2 = ifShow;
            }
            if (utils.isNumber(ifShow) || utils.isString(ifShow)) {
                isIfShow2 = !!ifShow;
            }
            if (utils.isFunction(ifShow)) {
                isIfShow2 = ifShow(action);
            }
            return isIfShow2;
        }
        const getActions = vue.computed(() => {
            const cacheActions = [];
            return (vue.toRaw(props2.actions) || []).filter((action, _) => {
                if (isIfShow(action) && cacheActions.length < props2.showCount - (props2.actions.length !== props2.showCount ? 1 : 0)) {
                    cacheActions.push(action);
                    return true;
                } else
                    return false;
            }).map((action) => {
                const { popConfirm } = action;
                return {
                    getPopupContainer: () => document.body,
                    type: "link",
                    size: "small",
                    ...action,
                    ...popConfirm || {},
                    onConfirm: popConfirm == null ? void 0 : popConfirm.confirm,
                    onCancel: popConfirm == null ? void 0 : popConfirm.cancel,
                    enable: !!popConfirm
                };
            });
        });
        const getDropdownList = vue.computed(() => {
            const cacheActions = [];
            const list = (vue.toRaw(props2.actions) || []).filter((action, index2) => {
                if (isIfShow(action) && cacheActions.length < props2.showCount - (props2.actions.length !== props2.showCount ? 1 : 0)) {
                    cacheActions.push(action);
                    return false;
                } else if (isIfShow(action))
                    return true;
            });
            return list.map((action, index2) => {
                const { label, popConfirm } = action;
                return {
                    ...action,
                    ...popConfirm,
                    onConfirm: popConfirm == null ? void 0 : popConfirm.confirm,
                    onCancel: popConfirm == null ? void 0 : popConfirm.cancel,
                    text: label,
                    divider: index2 < list.length - 1 ? props2.divider : false
                };
            });
        });
        const getAlign = vue.computed(() => {
            var _a2;
            const columns = ((_a2 = table2 == null ? void 0 : table2.getColumns) == null ? void 0 : _a2.call(table2)) || [];
            const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG);
            return (actionColumn == null ? void 0 : actionColumn.align) ?? "left";
        });
        function getTooltip(data) {
            return {
                getPopupContainer: () => vue.unref(table2 == null ? void 0 : table2.wrapRef.value) ?? document.body,
                placement: "bottom",
                ...utils.isString(data) ? { title: data } : data
            };
        }
        function onCellClick(e) {
            if (!props2.stopButtonPropagation)
                return;
            const path = e.composedPath();
            const isInButton = path.find((ele) => {
                var _a2;
                return ((_a2 = ele.tagName) == null ? void 0 : _a2.toUpperCase()) === "BUTTON";
            });
            isInButton && e.stopPropagation();
        }
        return (_ctx, _cache) => {
            const _component_a_button = vue.resolveComponent("a-button");
            return vue.openBlock(), vue.createElementBlock("div", {
                class: vue.normalizeClass([vue.unref(prefixCls2), vue.unref(getAlign)]),
                onClick: onCellClick
            }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(getActions), (action, index2) => {
                    return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                        key: `${index2}-${action.label}`
                    }, [
                        action.tooltip ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Tooltip), vue.normalizeProps(vue.mergeProps({ key: 0 }, getTooltip(action.tooltip))), {
                            default: vue.withCtx(() => [
                                vue.createVNode(vue.unref(_sfc_main$X), vue.normalizeProps(vue.guardReactiveProps(action)), {
                                    default: vue.withCtx(() => [
                                        action.icon ? (vue.openBlock(), vue.createBlock(vue.unref(Icon2), {
                                            key: 0,
                                            icon: action.icon,
                                            class: vue.normalizeClass({ "mr-1": !!action.label })
                                        }, null, 8, ["icon", "class"])) : vue.createCommentVNode("", true),
                                        action.label ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                                            vue.createTextVNode(vue.toDisplayString(action.label), 1)
                                        ], 64)) : vue.createCommentVNode("", true)
                                    ]),
                                    _: 2
                                }, 1040)
                            ]),
                            _: 2
                        }, 1040)) : (vue.openBlock(), vue.createBlock(vue.unref(_sfc_main$X), vue.normalizeProps(vue.mergeProps({ key: 1 }, action)), {
                            default: vue.withCtx(() => [
                                action.icon ? (vue.openBlock(), vue.createBlock(vue.unref(Icon2), {
                                    key: 0,
                                    icon: action.icon,
                                    class: vue.normalizeClass({ "mr-1": !!action.label })
                                }, null, 8, ["icon", "class"])) : vue.createCommentVNode("", true),
                                action.label ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                                    vue.createTextVNode(vue.toDisplayString(action.label), 1)
                                ], 64)) : vue.createCommentVNode("", true)
                            ]),
                            _: 2
                        }, 1040)),
                        __props.divider && index2 < vue.unref(getActions).length - 1 ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Divider), {
                            key: 2,
                            type: "vertical",
                            class: "action-divider"
                        })) : vue.createCommentVNode("", true)
                    ], 64);
                }), 128)),
                vue.unref(getDropdownList).length > 0 ? (vue.openBlock(), vue.createBlock(vue.unref(_sfc_main$W), {
                    key: 0,
                    trigger: ["hover"],
                    dropMenuList: vue.unref(getDropdownList),
                    popconfirm: ""
                }, {
                    default: vue.withCtx(() => [
                        vue.renderSlot(_ctx.$slots, "more"),
                        !_ctx.$slots.more ? (vue.openBlock(), vue.createBlock(_component_a_button, {
                            key: 0,
                            type: "link",
                            size: "small"
                        }, {
                            default: vue.withCtx(() => [
                                vue.createVNode(vue.unref(MoreOutlined$1), { class: "icon-more" })
                            ]),
                            _: 1
                        })) : vue.createCommentVNode("", true)
                    ]),
                    _: 3
                }, 8, ["dropMenuList"])) : vue.createCommentVNode("", true)
            ], 2);
        };
    }
});
const TableAction_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$q = { class: "thumb" };
const _sfc_main$U = /* @__PURE__ */ vue.defineComponent({
    __name: "ThumbUrl",
    props: {
        fileUrl: {
            type: String,
            default: ""
        },
        fileName: {
            type: String,
            default: ""
        }
    },
    setup(__props) {
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("span", _hoisted_1$q, [
                __props.fileUrl ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Image), {
                    key: 0,
                    src: __props.fileUrl,
                    width: 104
                }, null, 8, ["src"])) : vue.createCommentVNode("", true)
            ]);
        };
    }
});
const ThumbUrl_vue_vue_type_style_index_0_lang = "";
const {
    t: t$1
} = use.useI18n();
function createTableColumns() {
    return [{
        dataIndex: "thumbUrl",
        title: t$1("component.upload.legend"),
        width: 100,
        customRender: ({
                           record
                       }) => {
            const {
                thumbUrl
            } = record || {};
            return thumbUrl && vue.createVNode(_sfc_main$U, {
                "fileUrl": thumbUrl
            }, null);
        }
    }, {
        dataIndex: "name",
        title: t$1("component.upload.fileName"),
        align: "left",
        customRender: ({
                           text,
                           record
                       }) => {
            const {
                percent,
                status: uploadStatus
            } = record || {};
            let status = "normal";
            if (uploadStatus === UploadResultStatus.ERROR) {
                status = "exception";
            } else if (uploadStatus === UploadResultStatus.UPLOADING) {
                status = "active";
            } else if (uploadStatus === UploadResultStatus.SUCCESS) {
                status = "success";
            }
            return vue.createVNode("div", null, [vue.createVNode("p", {
                "class": "truncate mb-1 max-w-[280px]",
                "title": text
            }, [text]), vue.createVNode(antDesignVue.Progress, {
                "percent": percent,
                "size": "small",
                "status": status
            }, null)]);
        }
    }, {
        dataIndex: "size",
        title: t$1("component.upload.fileSize"),
        width: 100,
        customRender: ({
                           text = 0
                       }) => {
            return text && (text / 1024).toFixed(2) + "KB";
        }
    }, {
        dataIndex: "status",
        title: t$1("component.upload.fileStatue"),
        width: 100,
        customRender: ({
                           text
                       }) => {
            if (text === UploadResultStatus.SUCCESS) {
                return vue.createVNode(antDesignVue.Tag, {
                    "color": "green"
                }, {
                    default: () => t$1("component.upload.uploadSuccess")
                });
            } else if (text === UploadResultStatus.ERROR) {
                return vue.createVNode(antDesignVue.Tag, {
                    "color": "red"
                }, {
                    default: () => t$1("component.upload.uploadError")
                });
            } else if (text === UploadResultStatus.UPLOADING) {
                return vue.createVNode(antDesignVue.Tag, {
                    "color": "blue"
                }, {
                    default: () => t$1("component.upload.uploading")
                });
            }
            return text || t$1("component.upload.pending");
        }
    }];
}
function createActionColumn(handleRemove) {
    return {
        width: 120,
        title: t$1("component.upload.operating"),
        dataIndex: "action",
        fixed: false,
        customRender: ({
                           record
                       }) => {
            const actions = [{
                label: t$1("component.upload.del"),
                color: "error",
                onClick: handleRemove.bind(null, record)
            }];
            return vue.createVNode(_sfc_main$V, {
                "actions": actions,
                "outside": true
            }, null);
        }
    };
}
function createPreviewColumns() {
    return [{
        dataIndex: "url",
        title: t$1("component.upload.legend"),
        width: 100,
        customRender: ({
                           record
                       }) => {
            const {
                url
            } = record || {};
            return isImgTypeByName(url) && vue.createVNode(_sfc_main$U, {
                "fileUrl": url
            }, null);
        }
    }, {
        dataIndex: "name",
        title: t$1("component.upload.fileName"),
        align: "left"
    }];
}
function createPreviewActionColumn({
                                       handleRemove,
                                       handleDownload
                                   }) {
    return {
        width: 160,
        title: t$1("component.upload.operating"),
        dataIndex: "action",
        fixed: false,
        customRender: ({
                           record
                       }) => {
            const actions = [{
                label: t$1("component.upload.del"),
                color: "error",
                onClick: handleRemove.bind(null, record)
            }, {
                label: t$1("component.upload.download"),
                onClick: handleDownload.bind(null, record)
            }];
            return vue.createVNode(_sfc_main$V, {
                "actions": actions,
                "outside": true
            }, null);
        }
    };
}
const _sfc_main$T = /* @__PURE__ */ vue.defineComponent({
    name: "FileList",
    props: fileListProps,
    setup(props2, {
        emit
    }) {
        const modalFn = useModalContext();
        const sortableContainer = vue.ref();
        vue.watch(() => props2.dataSource, () => {
            vue.nextTick(() => {
                var _a2;
                (_a2 = modalFn == null ? void 0 : modalFn.redoModalHeight) == null ? void 0 : _a2.call(modalFn);
            });
        });
        if (props2.openDrag) {
            vue.onMounted(() => use.useSortable(sortableContainer, {
                ...props2.dragOptions,
                onEnd: ({
                            oldIndex,
                            newIndex
                        }) => {
                    if (oldIndex === newIndex) {
                        return;
                    }
                    const {
                        onAfterEnd
                    } = props2.dragOptions;
                    if (utils.isDef(oldIndex) && utils.isDef(newIndex)) {
                        const data = [...props2.dataSource];
                        const [oldItem] = data.splice(oldIndex, 1);
                        data.splice(newIndex, 0, oldItem);
                        vue.nextTick(() => {
                            emit("update:dataSource", data);
                            utils.isFunction(onAfterEnd) && onAfterEnd(data);
                        });
                    }
                }
            }).initSortable());
        }
        return () => {
            const {
                columns,
                actionColumn,
                dataSource
            } = props2;
            const columnList = [...columns, actionColumn];
            return (
                // x scrollbar
                vue.createVNode("div", {
                    "class": "overflow-x-auto"
                }, [vue.createVNode("table", {
                    "class": "file-table"
                }, [vue.createVNode("colgroup", null, [columnList.map((item) => {
                    const {
                        width = 0,
                        dataIndex
                    } = item;
                    const style2 = {
                        width: `${width}px`,
                        minWidth: `${width}px`
                    };
                    return vue.createVNode("col", {
                        "style": width ? style2 : {},
                        "key": dataIndex
                    }, null);
                })]), vue.createVNode("thead", null, [vue.createVNode("tr", {
                    "class": "file-table-tr"
                }, [columnList.map((item) => {
                    const {
                        title = "",
                        align = "center",
                        dataIndex
                    } = item;
                    return vue.createVNode("th", {
                        "class": ["file-table-th", align],
                        "key": dataIndex
                    }, [title]);
                })])]), vue.createVNode("tbody", {
                    "ref": sortableContainer
                }, [dataSource.map((record = {}, index2) => {
                    return vue.createVNode("tr", {
                        "class": "file-table-tr",
                        "key": `${index2 + record.name || ""}`
                    }, [columnList.map((item) => {
                        const {
                            dataIndex = "",
                            customRender,
                            align = "center"
                        } = item;
                        const render4 = customRender && utils.isFunction(customRender);
                        return vue.createVNode("td", {
                            "class": ["file-table-td break-all", align],
                            "key": dataIndex
                        }, [render4 ? customRender == null ? void 0 : customRender({
                            text: record[dataIndex],
                            record
                        }) : record[dataIndex]]);
                    })]);
                })])])])
            );
        };
    }
});
const FileList_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$p = { class: "upload-modal-toolbar" };
const _sfc_main$S = /* @__PURE__ */ vue.defineComponent({
    __name: "UploadModal",
    props: {
        ...basicProps$5,
        previewFileList: {
            type: Array,
            default: () => []
        }
    },
    emits: ["change", "register", "delete"],
    setup(__props, { emit }) {
        const props2 = __props;
        const columns = createTableColumns();
        const actionColumn = createActionColumn(handleRemove);
        const isUploadingRef = vue.ref(false);
        const fileListRef = vue.ref([]);
        const { accept, helpText, maxNumber, maxSize } = vue.toRefs(props2);
        const { t: t2 } = use.useI18n();
        const [register, { closeModal }] = useModalInner();
        const { getStringAccept, getHelpText } = useUploadType({
            acceptRef: accept,
            helpTextRef: helpText,
            maxNumberRef: maxNumber,
            maxSizeRef: maxSize
        });
        const { createMessage } = use.useMessage();
        const getIsSelectFile = vue.computed(() => {
            return fileListRef.value.length > 0 && !fileListRef.value.every(
                (item) => item.status === UploadResultStatus.SUCCESS
            );
        });
        const getOkButtonProps = vue.computed(() => {
            const someSuccess = fileListRef.value.some(
                (item) => item.status === UploadResultStatus.SUCCESS
            );
            return {
                disabled: isUploadingRef.value || fileListRef.value.length === 0 || !someSuccess
            };
        });
        const getUploadBtnText = vue.computed(() => {
            const someError = fileListRef.value.some(
                (item) => item.status === UploadResultStatus.ERROR
            );
            return isUploadingRef.value ? t2("component.upload.uploading") : someError ? t2("component.upload.reUploadFailed") : t2("component.upload.startUpload");
        });
        function beforeUpload(file) {
            const { size, name } = file;
            const { maxSize: maxSize2 } = props2;
            if (maxSize2 && file.size / 1024 / 1024 >= maxSize2) {
                createMessage.error(`只能上传不超过${maxSize2}MB的文件!`);
                return false;
            }
            const commonItem = {
                uuid: utils.buildUUID(),
                file,
                size,
                name,
                percent: 0,
                type: name.split(".").pop()
            };
            if (checkImgType(file)) {
                getBase64WithFile(file).then(({ result: thumbUrl }) => {
                    fileListRef.value = [
                        ...vue.unref(fileListRef),
                        {
                            thumbUrl,
                            ...commonItem
                        }
                    ];
                });
            } else {
                fileListRef.value = [...vue.unref(fileListRef), commonItem];
            }
            return false;
        }
        function handleRemove(record) {
            const index2 = fileListRef.value.findIndex((item) => item.uuid === record.uuid);
            index2 !== -1 && fileListRef.value.splice(index2, 1);
            emit("delete", record);
        }
        async function uploadApiByItem(item) {
            var _a2;
            const { api } = props2;
            if (!api || !utils.isFunction(api)) {
                return utils.warn("upload api must exist and be a function");
            }
            try {
                item.status = UploadResultStatus.UPLOADING;
                const ret = await ((_a2 = props2.api) == null ? void 0 : _a2.call(
                    props2,
                    {
                        data: {
                            ...props2.uploadParams || {}
                        },
                        file: item.file,
                        name: props2.name,
                        filename: props2.filename
                    },
                    function onUploadProgress(progressEvent) {
                        const complete = progressEvent.loaded / progressEvent.total * 100 | 0;
                        item.percent = complete;
                    }
                ));
                const { data } = ret;
                item.status = UploadResultStatus.SUCCESS;
                item.response = data;
                return {
                    success: true,
                    error: null
                };
            } catch (e) {
                item.status = UploadResultStatus.ERROR;
                return {
                    success: false,
                    error: e
                };
            }
        }
        async function handleStartUpload() {
            var _a2;
            const { maxNumber: maxNumber2 } = props2;
            if (fileListRef.value.length + ((_a2 = props2.previewFileList) == null ? void 0 : _a2.length) > maxNumber2) {
                return createMessage.warning(`最多只能上传${maxNumber2}个文件`);
            }
            try {
                isUploadingRef.value = true;
                const uploadFileList = fileListRef.value.filter(
                    (item) => item.status !== UploadResultStatus.SUCCESS
                ) || [];
                const data = await Promise.all(
                    uploadFileList.map((item) => {
                        return uploadApiByItem(item);
                    })
                );
                isUploadingRef.value = false;
                const errorList = data.filter((item) => !item.success);
                if (errorList.length > 0)
                    throw errorList;
            } catch (e) {
                isUploadingRef.value = false;
                throw e;
            }
        }
        function handleOk() {
            const { maxNumber: maxNumber2 } = props2;
            if (fileListRef.value.length > maxNumber2) {
                return createMessage.warning(`最多只能上传${maxNumber2}个文件`);
            }
            if (isUploadingRef.value) {
                return createMessage.warning(t2("component.upload.saveWarn"));
            }
            const fileList = [];
            for (const item of fileListRef.value) {
                const { status, response } = item;
                if (status === UploadResultStatus.SUCCESS && response) {
                    fileList.push(response.url);
                }
            }
            if (fileList.length <= 0) {
                return createMessage.warning(t2("component.upload.saveError"));
            }
            fileListRef.value = [];
            closeModal();
            emit("change", fileList);
        }
        async function handleCloseFunc() {
            if (!isUploadingRef.value) {
                fileListRef.value = [];
                return true;
            } else {
                createMessage.warning(t2("component.upload.uploadWait"));
                return false;
            }
        }
        return (_ctx, _cache) => {
            const _component_a_button = vue.resolveComponent("a-button");
            return vue.openBlock(), vue.createBlock(vue.unref(BasicModal), vue.mergeProps({
                width: "800px",
                title: vue.unref(t2)("component.upload.upload"),
                okText: vue.unref(t2)("component.upload.save")
            }, _ctx.$attrs, {
                onRegister: vue.unref(register),
                onOk: handleOk,
                closeFunc: handleCloseFunc,
                maskClosable: false,
                keyboard: false,
                class: "upload-modal",
                okButtonProps: vue.unref(getOkButtonProps),
                cancelButtonProps: { disabled: isUploadingRef.value }
            }), {
                centerFooter: vue.withCtx(() => [
                    vue.createVNode(_component_a_button, {
                        onClick: handleStartUpload,
                        color: "success",
                        disabled: !vue.unref(getIsSelectFile),
                        loading: isUploadingRef.value
                    }, {
                        default: vue.withCtx(() => [
                            vue.createTextVNode(vue.toDisplayString(vue.unref(getUploadBtnText)), 1)
                        ]),
                        _: 1
                    }, 8, ["disabled", "loading"])
                ]),
                default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_1$p, [
                        vue.createVNode(vue.unref(antDesignVue.Alert), {
                            message: vue.unref(getHelpText),
                            type: "info",
                            banner: "",
                            class: "upload-modal-toolbar__text"
                        }, null, 8, ["message"]),
                        vue.createVNode(vue.unref(antDesignVue.Upload), {
                            accept: vue.unref(getStringAccept),
                            multiple: _ctx.multiple,
                            "before-upload": beforeUpload,
                            "show-upload-list": false,
                            class: "upload-modal-toolbar__btn"
                        }, {
                            default: vue.withCtx(() => [
                                vue.createVNode(_component_a_button, { type: "primary" }, {
                                    default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("component.upload.choose")), 1)
                                    ]),
                                    _: 1
                                })
                            ]),
                            _: 1
                        }, 8, ["accept", "multiple"])
                    ]),
                    vue.createVNode(_sfc_main$T, {
                        dataSource: fileListRef.value,
                        "onUpdate:dataSource": _cache[0] || (_cache[0] = ($event) => fileListRef.value = $event),
                        columns: vue.unref(columns),
                        actionColumn: vue.unref(actionColumn),
                        openDrag: _ctx.fileListOpenDrag,
                        dragOptions: _ctx.fileListDragOptions
                    }, null, 8, ["dataSource", "columns", "actionColumn", "openDrag", "dragOptions"])
                ]),
                _: 1
            }, 16, ["title", "okText", "onRegister", "okButtonProps", "cancelButtonProps"]);
        };
    }
});
const UploadModal_vue_vue_type_style_index_0_lang = "";
const _sfc_main$R = /* @__PURE__ */ vue.defineComponent({
    __name: "UploadPreviewModal",
    props: previewProps,
    emits: ["list-change", "register", "delete"],
    setup(__props, { emit }) {
        const props2 = __props;
        const columns = createPreviewColumns();
        const actionColumn = createPreviewActionColumn({
            handleRemove,
            handleDownload
        });
        const [register] = useModalInner();
        const { t: t2 } = use.useI18n();
        const fileListRef = vue.ref([]);
        vue.watch(
            () => props2.value,
            (value) => {
                if (!utils.isArray(value))
                    value = [];
                fileListRef.value = value.filter((item) => !!item).map((item) => {
                    return {
                        url: item,
                        type: item.split(".").pop() || "",
                        name: item.split("/").pop() || ""
                    };
                });
            },
            { immediate: true }
        );
        function handleRemove(record) {
            const index2 = fileListRef.value.findIndex((item) => item.url === record.url);
            if (index2 !== -1) {
                const removed = fileListRef.value.splice(index2, 1);
                emit("delete", removed[0].url);
                emit(
                    "list-change",
                    fileListRef.value.map((item) => item.url)
                );
            }
        }
        function handleDownload(record) {
            const { url = "" } = record;
            utils.downloadByUrl({ url });
        }
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(BasicModal), vue.mergeProps({
                width: "800px",
                title: vue.unref(t2)("component.upload.preview"),
                class: "upload-preview-modal"
            }, _ctx.$attrs, {
                onRegister: vue.unref(register),
                showOkBtn: false
            }), {
                default: vue.withCtx(() => [
                    vue.createVNode(_sfc_main$T, {
                        dataSource: fileListRef.value,
                        columns: vue.unref(columns),
                        actionColumn: vue.unref(actionColumn)
                    }, null, 8, ["dataSource", "columns", "actionColumn"])
                ]),
                _: 1
            }, 16, ["title", "onRegister"]);
        };
    }
});
const UploadPreviewModal_vue_vue_type_style_index_0_lang = "";
const _sfc_main$Q = /* @__PURE__ */ vue.defineComponent({
    __name: "BasicUpload",
    props: uploadContainerProps,
    emits: ["change", "delete", "preview-delete", "update:value"],
    setup(__props, { emit }) {
        const props2 = __props;
        defineOptions({ name: "BasicUpload" });
        const attrs = vue.useAttrs();
        const { t: t2 } = use.useI18n();
        const [registerUploadModal, { openModal: openUploadModal }] = useModal();
        const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
        const fileList = vue.ref([]);
        const showPreview = vue.computed(() => {
            const { emptyHidePreview } = props2;
            if (!emptyHidePreview)
                return true;
            return emptyHidePreview ? fileList.value.length > 0 : true;
        });
        const bindValue = vue.computed(() => {
            const value = { ...attrs, ...props2 };
            return omit$1(value, "onChange");
        });
        vue.watch(
            () => props2.value,
            (value = []) => {
                fileList.value = utils.isArray(value) ? value : [];
            },
            { immediate: true }
        );
        function handleChange(urls) {
            fileList.value = [...vue.unref(fileList), ...urls || []];
            emit("update:value", fileList.value);
            emit("change", fileList.value);
        }
        function handlePreviewChange(urls) {
            fileList.value = [...urls || []];
            emit("update:value", fileList.value);
            emit("change", fileList.value);
        }
        function handleDelete(record) {
            emit("delete", record);
        }
        function handlePreviewDelete(url) {
            emit("preview-delete", url);
        }
        return (_ctx, _cache) => {
            const _component_a_button = vue.resolveComponent("a-button");
            return vue.openBlock(), vue.createElementBlock("div", null, [
                vue.createVNode(vue.unref(antDesignVue.Space), null, {
                    default: vue.withCtx(() => [
                        vue.createVNode(_component_a_button, {
                            type: "primary",
                            onClick: vue.unref(openUploadModal),
                            preIcon: "carbon:cloud-upload"
                        }, {
                            default: vue.withCtx(() => [
                                vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("component.upload.upload")), 1)
                            ]),
                            _: 1
                        }, 8, ["onClick"]),
                        vue.unref(showPreview) ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Tooltip), {
                            key: 0,
                            placement: "bottom"
                        }, {
                            title: vue.withCtx(() => [
                                vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("component.upload.uploaded")) + " ", 1),
                                fileList.value.length ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                                    vue.createTextVNode(vue.toDisplayString(fileList.value.length), 1)
                                ], 64)) : vue.createCommentVNode("", true)
                            ]),
                            default: vue.withCtx(() => [
                                vue.createVNode(_component_a_button, { onClick: vue.unref(openPreviewModal) }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(Icon2, { icon: "bi:eye" }),
                                        fileList.value.length && _ctx.showPreviewNumber ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                                            vue.createTextVNode(vue.toDisplayString(fileList.value.length), 1)
                                        ], 64)) : vue.createCommentVNode("", true)
                                    ]),
                                    _: 1
                                }, 8, ["onClick"])
                            ]),
                            _: 1
                        })) : vue.createCommentVNode("", true)
                    ]),
                    _: 1
                }),
                vue.createVNode(_sfc_main$S, vue.mergeProps(vue.unref(bindValue), {
                    previewFileList: fileList.value,
                    fileListOpenDrag: _ctx.fileListOpenDrag,
                    fileListDragOptions: _ctx.fileListDragOptions,
                    onRegister: vue.unref(registerUploadModal),
                    onChange: handleChange,
                    onDelete: handleDelete
                }), null, 16, ["previewFileList", "fileListOpenDrag", "fileListDragOptions", "onRegister"]),
                vue.createVNode(_sfc_main$R, {
                    value: fileList.value,
                    onRegister: vue.unref(registerPreviewModal),
                    onListChange: handlePreviewChange,
                    onDelete: handlePreviewDelete
                }, null, 8, ["value", "onRegister"])
            ]);
        };
    }
});
const _hoisted_1$o = { key: 0 };
const _hoisted_2$7 = { style: { "margin-top": "8px" } };
const _hoisted_3$5 = ["src"];
const _sfc_main$P = /* @__PURE__ */ vue.defineComponent({
    __name: "ImageUpload",
    props: {
        ...uploadContainerProps
    },
    emits: ["change", "update:value", "delete"],
    setup(__props, { emit }) {
        const props2 = __props;
        defineOptions({ name: "ImageUpload" });
        const { t: t2 } = use.useI18n();
        const { createMessage } = use.useMessage();
        const { accept, helpText, maxNumber, maxSize } = vue.toRefs(props2);
        const isInnerOperate = vue.ref(false);
        const { getStringAccept } = useUploadType({
            acceptRef: accept,
            helpTextRef: helpText,
            maxNumberRef: maxNumber,
            maxSizeRef: maxSize
        });
        const previewOpen = vue.ref(false);
        const previewImage = vue.ref("");
        const previewTitle = vue.ref("");
        const fileList = vue.ref([]);
        const isLtMsg = vue.ref(true);
        const isActMsg = vue.ref(true);
        vue.watch(
            () => props2.value,
            (v) => {
                if (isInnerOperate.value) {
                    isInnerOperate.value = false;
                    return;
                }
                if (v) {
                    let value = [];
                    if (utils.isArray(v)) {
                        value = v;
                    } else {
                        value.push(v);
                    }
                    fileList.value = value.map((item, i) => {
                        if (item && utils.isString(item)) {
                            return {
                                uid: -i + "",
                                name: item.substring(item.lastIndexOf("/") + 1),
                                status: "done",
                                url: item
                            };
                        } else if (item && utils.isObject(item)) {
                            return item;
                        } else {
                            return;
                        }
                    });
                }
            }
        );
        function getBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = (error2) => reject(error2);
            });
        }
        const handlePreview = async (file) => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            previewImage.value = file.url || file.preview || "";
            previewOpen.value = true;
            previewTitle.value = file.name || previewImage.value.substring(previewImage.value.lastIndexOf("/") + 1);
        };
        const handleRemove = async (file) => {
            if (fileList.value) {
                const index2 = fileList.value.findIndex((item) => item.uid === file.uid);
                index2 !== -1 && fileList.value.splice(index2, 1);
                const value = getValue2();
                isInnerOperate.value = true;
                emit("change", value);
                emit("delete", file);
            }
        };
        const handleCancel = () => {
            previewOpen.value = false;
            previewTitle.value = "";
        };
        const beforeUpload = (file) => {
            const { maxSize: maxSize2, accept: accept2 } = props2;
            const { name } = file;
            const isAct = isImgTypeByName(name);
            if (!isAct) {
                createMessage.error(`只能上传${accept2}格式文件`);
                isActMsg.value = false;
                setTimeout(() => isActMsg.value = true, 1e3);
            }
            const isLt = file.size / 1024 / 1024 > maxSize2;
            if (isLt) {
                createMessage.error(`只能上传不超过${maxSize2}MB的文件!`);
                isLtMsg.value = false;
                setTimeout(() => isLtMsg.value = true, 1e3);
            }
            return isAct && !isLt || antDesignVue.Upload.LIST_IGNORE;
        };
        async function customRequest(info) {
            var _a2;
            const { api } = props2;
            if (!api || !utils.isFunction(api)) {
                return utils.warn("upload api must exist and be a function");
            }
            try {
                const res = await ((_a2 = props2.api) == null ? void 0 : _a2.call(props2, {
                    data: {
                        ...props2.uploadParams || {}
                    },
                    file: info.file,
                    name: props2.name,
                    filename: props2.filename
                }));
                info.onSuccess(res.data);
                const value = getValue2();
                isInnerOperate.value = true;
                emit("change", value);
            } catch (e) {
                info.onError(e);
            }
        }
        function getValue2() {
            const list = (fileList.value || []).filter((item) => (item == null ? void 0 : item.status) === UploadResultStatus.DONE).map((item) => {
                var _a2;
                return (item == null ? void 0 : item.url) || ((_a2 = item == null ? void 0 : item.response) == null ? void 0 : _a2.url);
            });
            return props2.multiple ? list : list.length > 0 ? list[0] : "";
        }
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", null, [
                vue.createVNode(vue.unref(antDesignVue.Upload), vue.mergeProps(_ctx.$attrs, {
                    "file-list": fileList.value,
                    "onUpdate:file-list": _cache[0] || (_cache[0] = ($event) => fileList.value = $event),
                    "list-type": _ctx.listType,
                    accept: vue.unref(getStringAccept),
                    multiple: _ctx.multiple,
                    maxCount: vue.unref(maxNumber),
                    "before-upload": beforeUpload,
                    "custom-request": customRequest,
                    onPreview: handlePreview,
                    onRemove: handleRemove
                }), {
                    default: vue.withCtx(() => [
                        fileList.value && fileList.value.length < vue.unref(maxNumber) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$o, [
                            vue.createVNode(vue.unref(PlusOutlined$1)),
                            vue.createElementVNode("div", _hoisted_2$7, vue.toDisplayString(vue.unref(t2)("component.upload.upload")), 1)
                        ])) : vue.createCommentVNode("", true)
                    ]),
                    _: 1
                }, 16, ["file-list", "list-type", "accept", "multiple", "maxCount"]),
                vue.createVNode(vue.unref(antDesignVue.Modal), {
                    open: previewOpen.value,
                    title: previewTitle.value,
                    footer: null,
                    onCancel: handleCancel
                }, {
                    default: vue.withCtx(() => [
                        vue.createElementVNode("img", {
                            alt: "",
                            style: { "width": "100%" },
                            src: previewImage.value
                        }, null, 8, _hoisted_3$5)
                    ]),
                    _: 1
                }, 8, ["open", "title"])
            ]);
        };
    }
});
const ImageUpload_vue_vue_type_style_index_0_lang = "";
utils.withInstall(_sfc_main$P);
const BasicUpload = utils.withInstall(_sfc_main$Q);
const componentMap$2 = /* @__PURE__ */ new Map();
componentMap$2.set("Input", antDesignVue.Input);
componentMap$2.set("InputGroup", antDesignVue.Input.Group);
componentMap$2.set("InputPassword", antDesignVue.Input.Password);
componentMap$2.set("InputSearch", antDesignVue.Input.Search);
componentMap$2.set("InputTextArea", antDesignVue.Input.TextArea);
componentMap$2.set("InputNumber", antDesignVue.InputNumber);
componentMap$2.set("AutoComplete", antDesignVue.AutoComplete);
componentMap$2.set("Select", antDesignVue.Select);
componentMap$2.set("ApiSelect", ApiSelect);
componentMap$2.set("ApiTree", ApiTree);
componentMap$2.set("TreeSelect", antDesignVue.TreeSelect);
componentMap$2.set("ApiTreeSelect", ApiTreeSelect);
componentMap$2.set("ApiRadioGroup", ApiRadioGroup);
componentMap$2.set("Switch", antDesignVue.Switch);
componentMap$2.set("RadioButtonGroup", RadioButtonGroup);
componentMap$2.set("RadioGroup", antDesignVue.Radio.Group);
componentMap$2.set("Checkbox", antDesignVue.Checkbox);
componentMap$2.set("CheckboxGroup", antDesignVue.Checkbox.Group);
componentMap$2.set("ApiCascader", ApiCascader);
componentMap$2.set("Cascader", antDesignVue.Cascader);
componentMap$2.set("Slider", antDesignVue.Slider);
componentMap$2.set("Rate", antDesignVue.Rate);
componentMap$2.set("ApiTransfer", ApiTransfer);
componentMap$2.set("Upload", BasicUpload);
componentMap$2.set("DatePicker", antDesignVue.DatePicker);
componentMap$2.set("MonthPicker", antDesignVue.DatePicker.MonthPicker);
componentMap$2.set("RangePicker", antDesignVue.DatePicker.RangePicker);
componentMap$2.set("WeekPicker", antDesignVue.DatePicker.WeekPicker);
componentMap$2.set("TimePicker", antDesignVue.TimePicker);
componentMap$2.set("StrengthMeter", StrengthMeter);
componentMap$2.set("IconPicker", _sfc_main$19);
componentMap$2.set("InputCountDown", CountdownInput);
componentMap$2.set("Table", Table);
componentMap$2.set("Tinymce", _sfc_main$16);
componentMap$2.set("Divider", Divider);
function add(compName, component) {
    componentMap$2.set(compName, component);
}
function del(compName) {
    componentMap$2.delete(compName);
}
function createPlaceholderMessage$1(component) {
    if (component.includes("Input") || component.includes("Complete")) {
        return "请输入";
    }
    if (component.includes("Picker")) {
        return "请选择";
    }
    if (component.includes("Transfer") || component.includes("Select") || component.includes("Cascader") || component.includes("Checkbox") || component.includes("Radio") || component.includes("Switch")) {
        return "请选择";
    }
    return "";
}
const DATE_TYPE = ["DatePicker", "MonthPicker", "WeekPicker", "TimePicker"];
function genType() {
    return [...DATE_TYPE, "RangePicker"];
}
function setComponentRuleType(rule, component, valueFormat) {
    if (["DatePicker", "MonthPicker", "WeekPicker", "TimePicker"].includes(
        component
    )) {
        rule.type = valueFormat ? "string" : "object";
    } else if (["RangePicker", "Upload", "CheckboxGroup", "TimePicker"].includes(component)) {
        rule.type = "array";
    } else if (["InputNumber"].includes(component)) {
        rule.type = "number";
    }
}
function handleInputNumberValue(component, val) {
    if (!component)
        return val;
    if (["Input", "InputPassword", "InputSearch", "InputTextArea"].includes(
        component
    )) {
        return val && utils.isNumber(val) ? `${val}` : val;
    }
    return val;
}
const dateItemType = genType();
const defaultValueComponents = [
    "Input",
    "InputPassword",
    "InputSearch",
    "InputTextArea",
    "Tinymce"
];
function useItemLabelWidth(schemaItemRef, propsRef) {
    return vue.computed(() => {
        const schemaItem = vue.unref(schemaItemRef);
        const { labelCol = {}, wrapperCol = {} } = schemaItem.itemProps || {};
        const { labelWidth, disabledLabelWidth } = schemaItem;
        const {
            labelWidth: globalLabelWidth,
            labelCol: globalLabelCol,
            wrapperCol: globWrapperCol,
            layout
        } = vue.unref(propsRef);
        if (!globalLabelWidth && !labelWidth && !globalLabelCol || disabledLabelWidth) {
            labelCol.style = {
                textAlign: "left"
            };
            return { labelCol, wrapperCol };
        }
        let width = labelWidth || globalLabelWidth;
        const col = { ...globalLabelCol, ...labelCol };
        const wrapCol = { ...globWrapperCol, ...wrapperCol };
        if (width) {
            width = utils.isNumber(width) ? `${width}px` : width;
        }
        return {
            labelCol: { style: { width }, ...col },
            wrapperCol: {
                style: {
                    width: layout === "vertical" ? "100%" : `calc(100% - ${width})`
                },
                ...wrapCol
            }
        };
    });
}
function _isSlot$2(s) {
    return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const _sfc_main$O = /* @__PURE__ */ vue.defineComponent({
    name: "BasicFormItem",
    inheritAttrs: false,
    props: {
        schema: {
            type: Object,
            default: () => ({})
        },
        formProps: {
            type: Object,
            default: () => ({})
        },
        allDefaultValues: {
            type: Object,
            default: () => ({})
        },
        formModel: {
            type: Object,
            default: () => ({})
        },
        setFormModel: {
            type: Function,
            default: null
        },
        tableAction: {
            type: Object
        },
        formActionType: {
            type: Object
        },
        isAdvanced: {
            type: Boolean
        }
    },
    emits: ["clearCurrValidate"],
    setup(props2, {
        slots,
        emit
    }) {
        const {
            schema,
            formProps
        } = vue.toRefs(props2);
        const itemLabelWidthProp = useItemLabelWidth(schema, formProps);
        const getValues = vue.computed(() => {
            const {
                allDefaultValues,
                formModel,
                schema: schema2
            } = props2;
            const {
                mergeDynamicData
            } = props2.formProps;
            return {
                field: schema2.field,
                model: formModel,
                values: {
                    ...mergeDynamicData,
                    ...allDefaultValues,
                    ...formModel
                },
                schema: schema2
            };
        });
        const flag = vue.ref(0);
        const getComponentsProps = vue.computed(() => {
            var _a2;
            const {
                schema: schema2,
                tableAction,
                formModel,
                formActionType
            } = props2;
            let {
                componentProps = {}
            } = schema2;
            if (utils.isFunction(componentProps)) {
                componentProps = componentProps({
                    schema: schema2,
                    tableAction,
                    formModel,
                    formActionType
                }) ?? {};
            }
            if (schema2.component === "Divider") {
                componentProps = Object.assign({
                    type: "horizontal"
                }, componentProps, {
                    orientation: "left",
                    plain: true,
                    label: (schema2 == null ? void 0 : schema2.label) || ""
                });
            }
            if (schema2.component === "Input") {
                const maxlength = (componentProps == null ? void 0 : componentProps.maxlength) === void 0 ? 100 : componentProps.maxlength;
                componentProps = Object.assign({}, componentProps, {
                    maxlength
                });
                componentProps.onInputEvent = (e) => {
                    flag.value += 1;
                    componentProps.maxlength = (componentProps == null ? void 0 : componentProps.maxlength) === void 0 ? 100 : componentProps.maxlength;
                    if (!getValues.value.model[getValues.value.schema.field]) {
                        componentProps.showCount = true;
                    } else {
                        componentProps.showCount = false;
                    }
                };
                flag.value;
            }
            if (schema2.component === "Select") {
                const label = ((_a2 = componentProps == null ? void 0 : componentProps.fieldNames) == null ? void 0 : _a2.label) || "label";
                componentProps = Object.assign({}, componentProps, {
                    showSearch: true,
                    filterOption: (input, option) => {
                        return option[label].toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                });
            }
            return componentProps;
        });
        const getDisable = vue.computed(() => {
            const {
                disabled: globDisabled
            } = props2.formProps;
            const {
                dynamicDisabled
            } = props2.schema;
            const {
                disabled: itemDisabled = false
            } = vue.unref(getComponentsProps);
            let disabled = !!globDisabled || itemDisabled;
            if (utils.isBoolean(dynamicDisabled)) {
                disabled = dynamicDisabled;
            }
            if (utils.isFunction(dynamicDisabled)) {
                disabled = dynamicDisabled(vue.unref(getValues), globDisabled);
            }
            return disabled;
        });
        function getShow() {
            const {
                show,
                ifShow
            } = props2.schema;
            const {
                showAdvancedButton
            } = props2.formProps;
            const itemIsAdvanced = showAdvancedButton ? utils.isBoolean(props2.isAdvanced) ? props2.isAdvanced : true : true;
            let isShow = true;
            let isIfShow = true;
            if (utils.isBoolean(show)) {
                isShow = show;
            }
            if (utils.isBoolean(ifShow)) {
                isIfShow = ifShow;
            }
            if (utils.isFunction(show)) {
                isShow = show(vue.unref(getValues));
            }
            if (utils.isFunction(ifShow)) {
                isIfShow = ifShow(vue.unref(getValues));
            }
            isShow = isShow && itemIsAdvanced;
            return {
                isShow,
                isIfShow
            };
        }
        function handleRules() {
            var _a2;
            const {
                rules: defRules = [],
                component,
                rulesMessageJoinLabel,
                label,
                dynamicRules,
                required
            } = props2.schema;
            emit("clearCurrValidate", vue.unref(getValues).field);
            if (utils.isFunction(dynamicRules)) {
                return dynamicRules(vue.unref(getValues));
            }
            let rules = cloneDeep(defRules);
            const {
                rulesMessageJoinLabel: globalRulesMessageJoinLabel
            } = props2.formProps;
            const joinLabel = Reflect.has(props2.schema, "rulesMessageJoinLabel") ? rulesMessageJoinLabel : globalRulesMessageJoinLabel;
            const defaultMsg = createPlaceholderMessage$1(component) + `${joinLabel ? label : ""}`;
            function validator(rule, value) {
                const msg = rule.message || defaultMsg;
                if (value === void 0 || utils.isNull(value)) {
                    return Promise.reject(msg);
                } else if (Array.isArray(value) && value.length === 0) {
                    return Promise.reject(msg);
                } else if (typeof value === "string" && value.trim() === "") {
                    return Promise.reject(msg);
                } else if (typeof value === "object" && Reflect.has(value, "checked") && Reflect.has(value, "halfChecked") && Array.isArray(value.checked) && Array.isArray(value.halfChecked) && value.checked.length === 0 && value.halfChecked.length === 0) {
                    return Promise.reject(msg);
                }
                return Promise.resolve();
            }
            const getRequired = utils.isFunction(required) ? required(vue.unref(getValues)) : required;
            if (getRequired) {
                if (!rules || rules.length === 0) {
                    rules = [{
                        required: getRequired,
                        validator
                    }];
                } else {
                    const requiredIndex = rules.findIndex((rule) => Reflect.has(rule, "required"));
                    if (requiredIndex === -1) {
                        rules.push({
                            required: getRequired,
                            validator
                        });
                    }
                }
            }
            const requiredRuleIndex = rules.findIndex((rule) => Reflect.has(rule, "required") && !Reflect.has(rule, "validator"));
            if (requiredRuleIndex !== -1) {
                const rule = rules[requiredRuleIndex];
                const {
                    isShow
                } = getShow();
                if (!isShow) {
                    rule.required = false;
                }
                if (component) {
                    if (!Reflect.has(rule, "type")) {
                        rule.type = component === "InputNumber" ? "number" : "string";
                    }
                    rule.message = rule.message || defaultMsg;
                    if (component.includes("Input") || component.includes("Textarea")) {
                        rule.whitespace = true;
                    }
                    const valueFormat = (_a2 = vue.unref(getComponentsProps)) == null ? void 0 : _a2.valueFormat;
                    setComponentRuleType(rule, component, valueFormat);
                }
            }
            const characterInx = rules.findIndex((val) => val.max);
            if (characterInx !== -1 && !rules[characterInx].validator) {
                rules[characterInx].message = rules[characterInx].message || t("component.form.maxTip", [rules[characterInx].max]);
            }
            return rules;
        }
        function renderComponent() {
            var _a2;
            const {
                renderComponentContent,
                component,
                field,
                changeEvent = "change",
                valueField
            } = props2.schema;
            const isCheck = component && ["Switch", "Checkbox"].includes(component);
            const eventKey = `on${upperFirst$2(changeEvent)}`;
            const on = {
                [eventKey]: (...args) => {
                    const [e] = args;
                    if (propsData[eventKey] && args.length >= 1) {
                        propsData[eventKey](...args);
                    }
                    const target = e ? e.target : null;
                    const value = target ? isCheck ? target.checked : target.value : e;
                    props2.setFormModel(field, value);
                }
            };
            const Comp = componentMap$2.get(component);
            const {
                autoSetPlaceHolder,
                size
            } = props2.formProps;
            const propsData = {
                allowClear: true,
                getPopupContainer: (trigger) => trigger.parentNode,
                size,
                ...vue.unref(getComponentsProps),
                disabled: vue.unref(getDisable)
            };
            const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
            if (isCreatePlaceholder && component !== "RangePicker" && component) {
                propsData.placeholder = ((_a2 = vue.unref(getComponentsProps)) == null ? void 0 : _a2.placeholder) || createPlaceholderMessage$1(component);
            }
            propsData.codeField = field;
            propsData.formValues = vue.unref(getValues);
            const bindValue = {
                [valueField || (isCheck ? "checked" : "value")]: props2.formModel[field]
            };
            const compAttr = {
                ...propsData,
                ...on,
                ...bindValue
            };
            const handleInput = (e) => {
                (compAttr == null ? void 0 : compAttr.onInputEvent) && compAttr.onInputEvent(e);
            };
            if (!renderComponentContent) {
                return vue.createVNode(Comp, vue.mergeProps(compAttr, {
                    "onInput": handleInput
                }), null);
            }
            const compSlot = utils.isFunction(renderComponentContent) ? {
                ...renderComponentContent(vue.unref(getValues))
            } : {
                default: () => renderComponentContent
            };
            return vue.createVNode(Comp, compAttr, _isSlot$2(compSlot) ? compSlot : {
                default: () => [compSlot]
            });
        }
        function renderLabelHelpMessage() {
            const {
                label,
                helpMessage,
                helpComponentProps,
                subLabel
            } = props2.schema;
            const renderLabel = subLabel ? vue.createVNode("span", null, [label, vue.createTextVNode(" "), vue.createVNode("span", {
                "class": "text-secondary"
            }, [subLabel])]) : label;
            const getHelpMessage = utils.isFunction(helpMessage) ? helpMessage(vue.unref(getValues)) : helpMessage;
            if (!getHelpMessage || Array.isArray(getHelpMessage) && getHelpMessage.length === 0) {
                return renderLabel;
            }
            return vue.createVNode("span", null, [renderLabel, vue.createVNode(_sfc_main$1g, vue.mergeProps({
                "placement": "top",
                "class": "mx-1",
                "text": getHelpMessage
            }, helpComponentProps), null)]);
        }
        function renderItem() {
            const {
                itemProps,
                slot,
                render: render4,
                field,
                suffix,
                component
            } = props2.schema;
            const {
                labelCol,
                wrapperCol
            } = vue.unref(itemLabelWidthProp);
            const {
                colon
            } = props2.formProps;
            if (component === "Divider") {
                let _slot;
                return vue.createVNode(antDesignVue.Col, {
                    "span": 24
                }, {
                    default: () => [vue.createVNode(Divider, vue.unref(getComponentsProps), _isSlot$2(_slot = renderLabelHelpMessage()) ? _slot : {
                        default: () => [_slot]
                    })]
                });
            } else {
                const getContent = () => {
                    return slot ? utils.getSlot(slots, slot, vue.unref(getValues)) : render4 ? render4(vue.unref(getValues)) : renderComponent();
                };
                const showSuffix = !!suffix;
                const getSuffix = utils.isFunction(suffix) ? suffix(vue.unref(getValues)) : suffix;
                return vue.createVNode(antDesignVue.Form.Item, vue.mergeProps({
                    "name": field,
                    "colon": colon,
                    "class": {
                        "suffix-item": showSuffix
                    }
                }, itemProps, {
                    "label": renderLabelHelpMessage(),
                    "rules": handleRules(),
                    "labelCol": labelCol,
                    "wrapperCol": wrapperCol
                }), {
                    default: () => [vue.createVNode("div", {
                        "style": "display:flex"
                    }, [vue.createVNode("div", {
                        "style": "flex:1;"
                    }, [getContent()]), showSuffix && vue.createVNode("span", {
                        "class": "suffix"
                    }, [getSuffix])])]
                });
            }
        }
        return () => {
            let _slot2;
            const {
                colProps = {},
                colSlot,
                renderColContent,
                component
            } = props2.schema;
            if (!componentMap$2.has(component)) {
                return null;
            }
            const {
                baseColProps = {}
            } = props2.formProps;
            const realColProps = {
                ...baseColProps,
                ...colProps
            };
            if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                realColProps.span = (realColProps == null ? void 0 : realColProps.padSpan) || 24;
            }
            const {
                isIfShow,
                isShow
            } = getShow();
            const values = vue.unref(getValues);
            const getContent = () => {
                return colSlot ? utils.getSlot(slots, colSlot, values) : renderColContent ? renderColContent(values) : renderItem();
            };
            return isIfShow && vue.withDirectives(vue.createVNode(antDesignVue.Col, realColProps, _isSlot$2(_slot2 = getContent()) ? _slot2 : {
                default: () => [_slot2]
            }), [[vue.vShow, isShow]]);
        };
    }
});
const key = Symbol();
function createFormContext(context) {
    return use.createContext(context, key);
}
function useFormContext() {
    return use.useContext(key);
}
const _sfc_main$N = vue.defineComponent({
    name: "BasicFormAction",
    components: {
        FormItem: antDesignVue.Form.Item,
        BasicButton: _sfc_main$Y,
        [antDesignVue.Col.name]: antDesignVue.Col,
        Button: antDesignVue.Button
    },
    props: {
        showActionButtonGroup: {
            type: Boolean,
            default: true
        },
        showResetButton: {
            type: Boolean,
            default: true
        },
        showSubmitButton: {
            type: Boolean,
            default: true
        },
        showAdvancedButton: {
            type: Boolean,
            default: true
        },
        resetButtonOptions: {
            type: Object,
            default: () => ({})
        },
        submitButtonOptions: {
            type: Object,
            default: () => ({})
        },
        actionColOptions: {
            type: Object,
            default: () => ({})
        },
        actionSpan: {
            type: Number,
            default: 6
        },
        isAdvanced: {
            type: Boolean
        },
        hideAdvanceBtn: {
            type: Boolean
        }
    },
    // emits: ['toggle-advanced'],
    setup(props2) {
        const actionColOpt = vue.computed(() => {
            const { showAdvancedButton, actionSpan: span, actionColOptions } = props2;
            const actionSpan = 24 - span;
            const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {};
            const actionColOpt2 = {
                style: { textAlign: "right" },
                span: showAdvancedButton ? 6 : 4,
                ...advancedSpanObj,
                ...actionColOptions
            };
            return actionColOpt2;
        });
        const getResetBtnOptions = vue.computed(() => {
            return Object.assign(
                {
                    text: "重置"
                },
                props2.resetButtonOptions
            );
        });
        const getSubmitBtnOptions = vue.computed(() => {
            return Object.assign(
                {
                    text: "查询"
                },
                {
                    ...props2.submitButtonOptions,
                    loading: false
                }
            );
        });
        const getPreIcon = vue.computed(() => {
            if (getSubmitBtnOptions.value.loading) {
                return void 0;
            } else {
                return "ant-design:search-outlined";
            }
        });
        vue.watchEffect(() => {
            getPreIcon.value;
        });
        return {
            actionColOpt,
            getResetBtnOptions,
            getSubmitBtnOptions,
            // toggleAdvanced,
            ...useFormContext(),
            getPreIcon
        };
    }
});
function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BasicButton = vue.resolveComponent("BasicButton");
    const _component_Button = vue.resolveComponent("Button");
    const _component_FormItem = vue.resolveComponent("FormItem");
    return _ctx.showActionButtonGroup ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        style: vue.normalizeStyle([{ "width": "100%" }, { textAlign: _ctx.actionColOpt.style.textAlign }])
    }, [
        vue.createVNode(_component_FormItem, { class: "shy-form-action" }, {
            default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "resetBefore"),
                _ctx.showResetButton ? (vue.openBlock(), vue.createBlock(_component_BasicButton, vue.mergeProps({
                    key: 0,
                    type: "default",
                    class: "mr-2"
                }, _ctx.getResetBtnOptions, { onClick: _ctx.resetAction }), {
                    default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(_ctx.getResetBtnOptions.text), 1)
                    ]),
                    _: 1
                }, 16, ["onClick"])) : vue.createCommentVNode("", true),
                vue.renderSlot(_ctx.$slots, "submitBefore"),
                _ctx.showSubmitButton ? (vue.openBlock(), vue.createBlock(_component_Button, vue.mergeProps({
                    key: 1,
                    type: "primary",
                    class: "mr-2"
                }, { ..._ctx.getSubmitBtnOptions }, { onClick: _ctx.submitAction }), {
                    default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(_ctx.getSubmitBtnOptions.text), 1)
                    ]),
                    _: 1
                }, 16, ["onClick"])) : vue.createCommentVNode("", true),
                vue.renderSlot(_ctx.$slots, "advanceBefore"),
                vue.renderSlot(_ctx.$slots, "advanceAfter")
            ]),
            _: 3
        })
    ], 4)) : vue.createCommentVNode("", true);
}
const FormAction = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["render", _sfc_render$w]]);
function tryDeconstructArray(key2, value, target) {
    const pattern = /^\[(.+)\]$/;
    if (pattern.test(key2)) {
        const match = key2.match(pattern);
        if (match && match[1]) {
            const keys2 = match[1].split(",");
            value = Array.isArray(value) ? value : [value];
            keys2.forEach((k, index2) => {
                set(target, k.trim(), value[index2]);
            });
            return true;
        }
    }
}
function tryDeconstructObject(key2, value, target) {
    const pattern = /^\{(.+)\}$/;
    if (pattern.test(key2)) {
        const match = key2.match(pattern);
        if (match && match[1]) {
            const keys2 = match[1].split(",");
            value = utils.isObject(value) ? value : {};
            keys2.forEach((k) => {
                set(target, k.trim(), value[k.trim()]);
            });
            return true;
        }
    }
}
function useFormValues({
                           defaultValueRef,
                           getSchema,
                           formModel,
                           getProps
                       }) {
    function handleFormValues(values) {
        var _a2, _b;
        if (!utils.isObject(values)) {
            return {};
        }
        const res = {};
        for (const item of Object.entries(values)) {
            let [, value] = item;
            const [key2] = item;
            if (!key2 || utils.isArray(value) && value.length === 0 || utils.isFunction(value)) {
                continue;
            }
            const transformDateFunc = vue.unref(getProps).transformDateFunc;
            if (utils.isObject(value)) {
                value = transformDateFunc == null ? void 0 : transformDateFunc(value);
            }
            if (utils.isArray(value) && ((_a2 = value[0]) == null ? void 0 : _a2.format) && ((_b = value[1]) == null ? void 0 : _b.format)) {
                value = value.map((item2) => transformDateFunc == null ? void 0 : transformDateFunc(item2));
            }
            if (utils.isString(value)) {
                value = value.trim();
            }
            if (!tryDeconstructArray(key2, value, res) && !tryDeconstructObject(key2, value, res)) {
                set(res, key2, value);
            }
        }
        return handleRangeTimeValue(res);
    }
    function handleRangeTimeValue(values) {
        var _a2;
        const fieldMapToTime = vue.unref(getProps).fieldMapToTime;
        if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
            return values;
        }
        for (const [
            field,
            [startTimeKey, endTimeKey],
            format = "YYYY-MM-DD"
        ] of fieldMapToTime) {
            if (!field || !startTimeKey || !endTimeKey) {
                continue;
            }
            if (!values[field]) {
                Reflect.deleteProperty(values, field);
                continue;
            }
            const [startTime, endTime] = values[field];
            const [startTimeFormat, endTimeFormat] = Array.isArray(format) ? format : [format, format];
            values[startTimeKey] = utils.dateUtil(startTime).format(startTimeFormat);
            values[endTimeKey] = utils.dateUtil(endTime).format(endTimeFormat);
            Reflect.deleteProperty(values, field);
        }
        const rangePickerField = ((_a2 = vue.unref(getProps)) == null ? void 0 : _a2.rangePickerField) || [];
        rangePickerField.forEach((fieldConfig) => {
            if (values[fieldConfig[0]] && Array.isArray(values[fieldConfig[0]])) {
                const startTimeKey = fieldConfig[1] || "00:00:00";
                const endTimeKey = fieldConfig[2] || "23:59:59";
                values[fieldConfig[0]][0] = dayjs(values[fieldConfig[0]][0]).format("YYYY-MM-DD") + " " + startTimeKey;
                values[fieldConfig[0]][1] = dayjs(values[fieldConfig[0]][1]).format("YYYY-MM-DD") + " " + endTimeKey;
            }
        });
        return values;
    }
    function initDefault() {
        const schemas = vue.unref(getSchema);
        const obj = {};
        schemas.forEach((item) => {
            const { defaultValue } = item;
            if (!utils.isNullOrUnDef(defaultValue)) {
                obj[item.field] = defaultValue;
                if (formModel[item.field] === void 0) {
                    formModel[item.field] = defaultValue;
                }
            }
        });
        defaultValueRef.value = cloneDeep(obj);
    }
    return { handleFormValues, initDefault };
}
const BASIC_COL_LEN = 24;
const useAdvanced = ({
                         advanceState,
                         emit,
                         getProps,
                         getSchema,
                         formModel,
                         defaultValueRef
                     }) => {
    const vm = vue.getCurrentInstance();
    const { realWidthRef, screenEnum, screenRef } = use.useBreakpoint();
    const getEmptySpan = vue.computed(() => {
        if (!advanceState.isAdvanced) {
            return 0;
        }
        const emptySpan = vue.unref(getProps).emptySpan || 0;
        if (utils.isNumber(emptySpan)) {
            return emptySpan;
        }
        if (utils.isObject(emptySpan)) {
            const { span = 0 } = emptySpan;
            const screen = vue.unref(screenRef);
            const screenSpan = emptySpan[screen.toLowerCase()];
            return screenSpan || span || 0;
        }
        return 0;
    });
    const debounceUpdateAdvanced = useDebounceFn$1(updateAdvanced, 30);
    vue.watch(
        [
            () => vue.unref(getSchema),
            () => advanceState.isAdvanced,
            () => vue.unref(realWidthRef)
        ],
        () => {
            const { showAdvancedButton } = vue.unref(getProps);
            if (showAdvancedButton) {
                debounceUpdateAdvanced();
            }
        },
        { immediate: true }
    );
    function getAdvanced(itemCol, itemColSum = 0, isLastAction = false) {
        const width = vue.unref(realWidthRef);
        const mdWidth = parseInt(itemCol.md) || parseInt(itemCol.xs) || parseInt(itemCol.sm) || itemCol.span || BASIC_COL_LEN;
        const lgWidth = parseInt(itemCol.lg) || mdWidth;
        const xlWidth = parseInt(itemCol.xl) || lgWidth;
        const xxlWidth = parseInt(itemCol.xxl) || xlWidth;
        if (width <= screenEnum.LG) {
            itemColSum += mdWidth;
        } else if (width < screenEnum.XL) {
            itemColSum += lgWidth;
        } else if (width < screenEnum.XXL) {
            itemColSum += xlWidth;
        } else {
            itemColSum += xxlWidth;
        }
        if (isLastAction) {
            advanceState.hideAdvanceBtn = false;
            if (itemColSum <= BASIC_COL_LEN * 2) {
                advanceState.hideAdvanceBtn = true;
                advanceState.isAdvanced = true;
            } else if (itemColSum > BASIC_COL_LEN * 2 && itemColSum <= BASIC_COL_LEN * (vue.unref(getProps).autoAdvancedLine || 3)) {
                advanceState.hideAdvanceBtn = false;
            } else if (!advanceState.isLoad) {
                advanceState.isLoad = true;
                advanceState.isAdvanced = !advanceState.isAdvanced;
            }
            return { isAdvanced: advanceState.isAdvanced, itemColSum };
        }
        if (itemColSum > BASIC_COL_LEN * (vue.unref(getProps).alwaysShowLines || 1)) {
            return { isAdvanced: advanceState.isAdvanced, itemColSum };
        } else {
            return { isAdvanced: true, itemColSum };
        }
    }
    const fieldsIsAdvancedMap = vue.shallowReactive({});
    function updateAdvanced() {
        var _a2;
        let itemColSum = 0;
        let realItemColSum = 0;
        const { baseColProps = {} } = vue.unref(getProps);
        for (const schema of vue.unref(getSchema)) {
            const { show, colProps } = schema;
            let isShow = true;
            if (utils.isBoolean(show)) {
                isShow = show;
            }
            if (utils.isFunction(show)) {
                isShow = show({
                    schema,
                    model: formModel,
                    field: schema.field,
                    values: {
                        ...vue.unref(defaultValueRef),
                        ...formModel
                    }
                });
            }
            if (isShow && (colProps || baseColProps)) {
                const { itemColSum: sum, isAdvanced } = getAdvanced(
                    { ...baseColProps, ...colProps },
                    itemColSum
                );
                itemColSum = sum || 0;
                if (isAdvanced) {
                    realItemColSum = itemColSum;
                }
                fieldsIsAdvancedMap[schema.field] = isAdvanced;
            }
        }
        (_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$forceUpdate();
        advanceState.actionSpan = realItemColSum % BASIC_COL_LEN + vue.unref(getEmptySpan);
        getAdvanced(
            vue.unref(getProps).actionColOptions || { span: BASIC_COL_LEN },
            itemColSum,
            true
        );
        emit("advanced-change");
    }
    function handleToggleAdvanced() {
        advanceState.isAdvanced = !advanceState.isAdvanced;
    }
    return { handleToggleAdvanced, fieldsIsAdvancedMap };
};
function useFormEvents({
                           emit,
                           getProps,
                           formModel,
                           getSchema,
                           defaultValueRef,
                           formElRef,
                           schemaRef,
                           handleFormValues
                       }) {
    async function resetFields() {
        const { resetFunc, submitOnReset } = vue.unref(getProps);
        resetFunc && utils.isFunction(resetFunc) && await resetFunc();
        const formEl = vue.unref(formElRef);
        if (!formEl)
            return;
        Object.keys(formModel).forEach((key2) => {
            const schema = vue.unref(getSchema).find((item) => item.field === key2);
            const isInput = (schema == null ? void 0 : schema.component) && defaultValueComponents.includes(schema.component);
            const defaultValue = cloneDeep(defaultValueRef.value[key2]);
            formModel[key2] = isInput ? defaultValue || "" : defaultValue;
            if ((schema == null ? void 0 : schema.component) === "Tinymce") {
                formModel[key2] = isInput ? defaultValue || " " : defaultValue;
            }
        });
        vue.nextTick(() => clearValidate());
        emit("reset", vue.toRaw(formModel));
        submitOnReset && handleSubmit();
    }
    async function setFieldsValue(values) {
        const fields = vue.unref(getSchema).map((item) => item.field).filter(Boolean);
        const delimiter = ".";
        const nestKeyArray = fields.filter((item) => item.indexOf(delimiter) >= 0);
        const validKeys = [];
        Object.keys(values).forEach((key2) => {
            const schema = vue.unref(getSchema).find((item) => item.field === key2);
            let value = values[key2];
            const hasKey = Reflect.has(values, key2);
            value = handleInputNumberValue(schema == null ? void 0 : schema.component, value);
            if (hasKey && fields.includes(key2)) {
                if (itemIsDateType(key2)) {
                    if (Array.isArray(value)) {
                        const arr = [];
                        for (const ele of value) {
                            arr.push(ele ? ele : null);
                        }
                        formModel[key2] = arr;
                    } else {
                        const { componentProps } = schema || {};
                        let _props = componentProps;
                        if (typeof componentProps === "function") {
                            _props = _props({ formModel });
                        }
                        formModel[key2] = value ? (_props == null ? void 0 : _props.valueFormat) ? value : utils.dateUtil(value) : null;
                    }
                } else {
                    formModel[key2] = value;
                }
                validKeys.push(key2);
            } else {
                nestKeyArray.forEach((nestKey) => {
                    try {
                        const value2 = nestKey.split(".").reduce((out, item) => out[item], values);
                        if (utils.isDef(value2)) {
                            formModel[nestKey] = value2;
                            validKeys.push(nestKey);
                        }
                    } catch (e) {
                        if (utils.isDef(defaultValueRef.value[nestKey])) {
                            formModel[nestKey] = cloneDeep(defaultValueRef.value[nestKey]);
                        }
                    }
                });
            }
        });
        validateFields(validKeys).catch(() => {
        });
    }
    async function removeSchemaByField(fields) {
        const schemaList = cloneDeep(vue.unref(getSchema));
        if (!fields) {
            return;
        }
        let fieldList = utils.isString(fields) ? [fields] : fields;
        if (utils.isString(fields)) {
            fieldList = [fields];
        }
        for (const field of fieldList) {
            _removeSchemaByFeild(field, schemaList);
        }
        schemaRef.value = schemaList;
    }
    function _removeSchemaByFeild(field, schemaList) {
        if (utils.isString(field)) {
            const index2 = schemaList.findIndex((schema) => schema.field === field);
            if (index2 !== -1) {
                delete formModel[field];
                schemaList.splice(index2, 1);
            }
        }
    }
    async function appendSchemaByField(schema, prefixField, first = false) {
        const schemaList = cloneDeep(vue.unref(getSchema));
        const addSchemaIds = Array.isArray(schema) ? schema.map((item) => item.field) : [schema.field];
        if (schemaList.find((item) => addSchemaIds.includes(item.field))) {
            utils.error("There are schemas that have already been added");
            return;
        }
        const index2 = schemaList.findIndex((schema2) => schema2.field === prefixField);
        const _schemaList = utils.isObject(schema) ? [schema] : schema;
        if (!prefixField || index2 === -1 || first) {
            first ? schemaList.unshift(..._schemaList) : schemaList.push(..._schemaList);
        } else if (index2 !== -1) {
            schemaList.splice(index2 + 1, 0, ..._schemaList);
        }
        schemaRef.value = schemaList;
        _setDefaultValue(schema);
    }
    async function resetSchema(data) {
        let updateData = [];
        if (utils.isObject(data)) {
            updateData.push(data);
        }
        if (utils.isArray(data)) {
            updateData = [...data];
        }
        const hasField = updateData.every(
            (item) => item.component === "Divider" || Reflect.has(item, "field") && item.field
        );
        if (!hasField) {
            utils.error(
                "All children of the form Schema array that need to be updated must contain the `field` field"
            );
            return;
        }
        schemaRef.value = updateData;
    }
    async function updateSchema(data) {
        let updateData = [];
        if (utils.isObject(data)) {
            updateData.push(data);
        }
        if (utils.isArray(data)) {
            updateData = [...data];
        }
        const hasField = updateData.every(
            (item) => item.component === "Divider" || Reflect.has(item, "field") && item.field
        );
        if (!hasField) {
            utils.error(
                "All children of the form Schema array that need to be updated must contain the `field` field"
            );
            return;
        }
        const schema = [];
        vue.unref(getSchema).forEach((val) => {
            let _val;
            updateData.forEach((item) => {
                if (val.field === item.field) {
                    _val = item;
                }
            });
            if (_val !== void 0 && val.field === _val.field) {
                const newSchema = utils.deepMerge(val, _val);
                schema.push(newSchema);
            } else {
                schema.push(val);
            }
        });
        _setDefaultValue(schema);
        schemaRef.value = uniqBy(schema, "field");
    }
    function _setDefaultValue(data) {
        let schemas = [];
        if (utils.isObject(data)) {
            schemas.push(data);
        }
        if (utils.isArray(data)) {
            schemas = [...data];
        }
        const obj = {};
        const currentFieldsValue = getFieldsValue();
        schemas.forEach((item) => {
            if (item.component != "Divider" && Reflect.has(item, "field") && item.field && !utils.isNullOrUnDef(item.defaultValue) && !(item.field in currentFieldsValue)) {
                obj[item.field] = item.defaultValue;
            }
        });
        setFieldsValue(obj);
    }
    function getFieldsValue() {
        const formEl = vue.unref(formElRef);
        if (!formEl)
            return {};
        return handleFormValues(vue.toRaw(vue.unref(formModel)));
    }
    function itemIsDateType(key2) {
        return vue.unref(getSchema).some((item) => {
            return item.field === key2 ? dateItemType.includes(item.component) : false;
        });
    }
    async function validateFields(nameList) {
        var _a2;
        return (_a2 = vue.unref(formElRef)) == null ? void 0 : _a2.validateFields(nameList);
    }
    async function validate(nameList) {
        var _a2;
        return await ((_a2 = vue.unref(formElRef)) == null ? void 0 : _a2.validate(nameList));
    }
    async function clearValidate(name) {
        var _a2;
        await ((_a2 = vue.unref(formElRef)) == null ? void 0 : _a2.clearValidate(name));
    }
    async function scrollToField(name, options) {
        var _a2;
        await ((_a2 = vue.unref(formElRef)) == null ? void 0 : _a2.scrollToField(name, options));
    }
    async function handleSubmit(e) {
        e && e.preventDefault();
        const { submitFunc } = vue.unref(getProps);
        if (submitFunc && utils.isFunction(submitFunc)) {
            await submitFunc();
            return;
        }
        const formEl = vue.unref(formElRef);
        if (!formEl)
            return;
        try {
            const values = await validate();
            const res = handleFormValues(values);
            emit("submit", res);
        } catch (error2) {
            throw new Error(error2);
        }
    }
    return {
        handleSubmit,
        clearValidate,
        validate,
        validateFields,
        getFieldsValue,
        updateSchema,
        resetSchema,
        appendSchemaByField,
        removeSchemaByField,
        resetFields,
        setFieldsValue,
        scrollToField
    };
}
async function useAutoFocus({
                                getSchema,
                                getProps,
                                formElRef,
                                isInitedDefault
                            }) {
    vue.watchEffect(async () => {
        if (vue.unref(isInitedDefault) || !vue.unref(getProps).autoFocusFirstItem) {
            return;
        }
        await vue.nextTick();
        const schemas = vue.unref(getSchema);
        const formEl = vue.unref(formElRef);
        const el = formEl == null ? void 0 : formEl.$el;
        if (!formEl || !el || !schemas || schemas.length === 0) {
            return;
        }
        const firstItem = schemas[0];
        if (!firstItem.component.includes("Input")) {
            return;
        }
        const inputEl = el.querySelector(
            ".ant-row:first-child input"
        );
        if (!inputEl)
            return;
        inputEl == null ? void 0 : inputEl.focus();
    });
}
const basicProps$4 = {
    model: {
        type: Object,
        default: () => ({})
    },
    // 标签宽度  固定宽度
    labelWidth: {
        type: [Number, String],
        default: 0
    },
    fieldMapToTime: {
        type: Array,
        default: () => []
    },
    compact: {
        type: Boolean
    },
    // 表单配置规则
    schemas: {
        type: Array,
        default: () => []
    },
    mergeDynamicData: {
        type: Object,
        default: null
    },
    baseRowStyle: {
        type: Object
    },
    baseColProps: {
        type: Object
    },
    autoSetPlaceHolder: {
        type: Boolean,
        default: true
    },
    // 在INPUT组件上单击回车时，是否自动提交
    autoSubmitOnEnter: {
        type: Boolean,
        default: false
    },
    submitOnReset: {
        type: Boolean
    },
    submitOnChange: {
        type: Boolean
    },
    size: {
        type: String,
        default: "default"
    },
    // // 禁用表单
    disabled: {
        type: Boolean
    },
    emptySpan: {
        type: [Number, Object],
        default: 0
    },
    // // 是否显示收起展开按钮
    showAdvancedButton: {
        type: Boolean
    },
    // // 转化时间
    transformDateFunc: {
        type: Function,
        default: (date) => {
            var _a2;
            return ((_a2 = date == null ? void 0 : date.format) == null ? void 0 : _a2.call(date, "YYYY-MM-DD HH:mm:ss")) ?? date;
        }
    },
    rulesMessageJoinLabel: {
        type: Boolean,
        default: true
    },
    // // 超过3行自动折叠
    autoAdvancedLine: {
        type: Number,
        default: 3
    },
    // // 不受折叠影响的行数
    alwaysShowLines: {
        type: Number,
        default: 1
    },
    // // 是否显示操作按钮
    showActionButtonGroup: {
        type: Boolean,
        default: true
    },
    // // 操作列Col配置
    actionColOptions: {
        type: Object
    },
    // // 显示重置按钮
    showResetButton: {
        type: Boolean,
        default: true
    },
    // 是否聚焦第一个输入框，只在第一个表单项为input的时候作用
    autoFocusFirstItem: {
        type: Boolean
    },
    // 重置按钮配置
    resetButtonOptions: {
        type: Object
    },
    // // 显示确认按钮
    showSubmitButton: {
        type: Boolean,
        default: true
    },
    // // 确认按钮配置
    submitButtonOptions: {
        type: Object
    },
    // // 自定义重置函数
    resetFunc: {
        type: Function
    },
    submitFunc: {
        type: Function
    },
    // // 以下为默认props
    hideRequiredMark: {
        type: Boolean
    },
    labelCol: {
        type: Object
    },
    layout: {
        type: String,
        default: "horizontal"
    },
    tableAction: {
        type: Object
    },
    wrapperCol: {
        type: Object
    },
    colon: {
        type: Boolean
    },
    labelAlign: {
        type: String
    },
    rowProps: {
        type: Object
    },
    rangePickerField: {
        type: Array,
        default: () => []
    }
};
const globalConfig = {
    form: {},
    table: {}
};
const registerGlobalConfig = (config) => {
    Object.keys(config).forEach((key2) => {
        const value = config[key2];
        globalConfig[key2] = value;
    });
};
const useGlobalConfig = (key2) => {
    const config = globalConfig[key2];
    const setConfig = (value) => {
        globalConfig[key2] = value;
    };
    return { config, setConfig };
};
const _sfc_main$M = vue.defineComponent({
    name: "BasicForm",
    components: { FormItem: _sfc_main$O, Form: antDesignVue.Form, Row: antDesignVue.Row, FormAction, DownOutlined: DownOutlined$1 },
    props: basicProps$4,
    emits: [
        "advanced-change",
        "reset",
        "submit",
        "register",
        "field-value-change"
    ],
    setup(props2, { emit, attrs }) {
        const formModel = vue.reactive({});
        const modalFn = useModalContext();
        const advanceState = vue.reactive({
            isAdvanced: true,
            hideAdvanceBtn: false,
            isLoad: false,
            actionSpan: 6
        });
        const defaultValueRef = vue.ref({});
        const isInitedDefaultRef = vue.ref(false);
        const propsRef = vue.ref({});
        const schemaRef = vue.ref(null);
        const formElRef = vue.ref(null);
        const prefixCls2 = "shy-basic-form";
        const { config } = useGlobalConfig("form");
        const getProps = vue.computed(() => {
            return {
                ...props2,
                ...config,
                // 全局注入属性
                ...vue.unref(propsRef)
            };
        });
        const getFormClass = vue.computed(() => {
            return [
                prefixCls2,
                {
                    [`${prefixCls2}--compact`]: vue.unref(getProps).compact
                }
            ];
        });
        const getToggleClass = vue.computed(() => {
            return [
                `${prefixCls2}-toggle-icon`,
                {
                    expend: advanceState.isAdvanced
                }
            ];
        });
        const getRow = vue.computed(() => {
            const { baseRowStyle = {}, rowProps } = vue.unref(getProps);
            return {
                style: baseRowStyle,
                ...rowProps
            };
        });
        const getBindValue = vue.computed(
            () => ({ ...attrs, ...props2, ...vue.unref(getProps) })
        );
        const getSchema = vue.computed(() => {
            const schemas = vue.unref(schemaRef) || vue.unref(getProps).schemas;
            for (const schema of schemas) {
                const {
                    defaultValue,
                    component,
                    componentProps,
                    isHandleDateDefaultValue = true
                } = schema;
                if (isHandleDateDefaultValue && defaultValue && component && dateItemType.includes(component)) {
                    const valueFormat = componentProps ? componentProps["valueFormat"] : null;
                    if (!Array.isArray(defaultValue)) {
                        schema.defaultValue = valueFormat ? utils.dateUtil(defaultValue).format(valueFormat) : utils.dateUtil(defaultValue);
                    } else {
                        const def = [];
                        defaultValue.forEach((item) => {
                            def.push(
                                valueFormat ? utils.dateUtil(item).format(valueFormat) : utils.dateUtil(item)
                            );
                        });
                        schema.defaultValue = def;
                    }
                }
            }
            if (vue.unref(getProps).showAdvancedButton) {
                return cloneDeep(
                    schemas.filter(
                        (schema) => schema.component !== "Divider"
                    )
                );
            } else {
                return cloneDeep(schemas);
            }
        });
        const { handleToggleAdvanced, fieldsIsAdvancedMap } = useAdvanced({
            advanceState,
            emit,
            getProps,
            getSchema,
            formModel,
            defaultValueRef
        });
        const { handleFormValues, initDefault } = useFormValues({
            getProps,
            defaultValueRef,
            getSchema,
            formModel
        });
        useAutoFocus({
            getSchema,
            getProps,
            isInitedDefault: isInitedDefaultRef,
            formElRef
        });
        const {
            handleSubmit,
            setFieldsValue,
            clearValidate,
            validate,
            validateFields,
            getFieldsValue,
            updateSchema,
            resetSchema,
            appendSchemaByField,
            removeSchemaByField,
            resetFields,
            scrollToField
        } = useFormEvents({
            emit,
            getProps,
            formModel,
            getSchema,
            defaultValueRef,
            //@ts-ignore
            formElRef,
            //@ts-ignore
            schemaRef,
            handleFormValues
        });
        createFormContext({
            resetAction: resetFields,
            submitAction: handleSubmit
        });
        vue.watch(
            () => vue.unref(getProps).model,
            () => {
                const { model } = vue.unref(getProps);
                if (!model)
                    return;
                setFieldsValue(model);
            },
            {
                immediate: true
            }
        );
        vue.watch(
            () => vue.unref(getProps).schemas,
            (schemas) => {
                resetSchema(schemas ?? []);
            }
        );
        vue.watch(
            () => getSchema.value,
            (schema) => {
                vue.nextTick(() => {
                    var _a2;
                    (_a2 = modalFn == null ? void 0 : modalFn.redoModalHeight) == null ? void 0 : _a2.call(modalFn);
                });
                if (vue.unref(isInitedDefaultRef)) {
                    return;
                }
                if (schema == null ? void 0 : schema.length) {
                    initDefault();
                    isInitedDefaultRef.value = true;
                }
            }
        );
        const tempFormModel = vue.reactive({});
        vue.watch(
            () => formModel,
            useDebounceFn$1((val) => {
                var _a2;
                for (const key2 in val) {
                    if (val[key2] !== tempFormModel[key2]) {
                        (_a2 = vue.unref(getProps).schemas) == null ? void 0 : _a2.forEach((item) => {
                            var _a3;
                            const isComponentProps = item.field === key2 && item.componentProps;
                            if (isComponentProps && !utils.isFunction(item.componentProps) && ((_a3 = item.componentProps) == null ? void 0 : _a3.onModelChange)) {
                                item.componentProps.onModelChange(val[key2]);
                            } else if (isComponentProps && utils.isFunction(item.componentProps)) {
                                const modelProps = item.componentProps({
                                    schema: item,
                                    formModel,
                                    formActionType,
                                    tableAction: props2.tableAction
                                });
                                if (modelProps.onModelChange) {
                                    modelProps.onModelChange(val[key2]);
                                }
                            }
                        });
                    }
                }
                Object.assign(tempFormModel, formModel);
                vue.unref(getProps).submitOnChange && handleSubmit();
            }, 300),
            { deep: true }
        );
        async function setProps(formProps) {
            propsRef.value = utils.deepMerge(vue.unref(propsRef) || {}, formProps);
        }
        function setFormModel(key2, value) {
            formModel[key2] = value;
            const { validateTrigger } = vue.unref(getBindValue);
            if (!validateTrigger || validateTrigger === "change") {
                validateFields([key2]).catch(() => {
                });
            }
            emit("field-value-change", key2, value);
        }
        function handleEnterPress(e) {
            const { autoSubmitOnEnter } = vue.unref(getProps);
            if (!autoSubmitOnEnter)
                return;
            if (e.key === "Enter" && e.target && e.target instanceof HTMLElement) {
                const target = e.target;
                if (target && target.tagName && target.tagName.toUpperCase() == "INPUT") {
                    handleSubmit();
                }
            }
        }
        const formActionType = {
            getFieldsValue,
            setFieldsValue,
            resetFields,
            updateSchema,
            resetSchema,
            setProps,
            removeSchemaByField,
            appendSchemaByField,
            clearValidate,
            validateFields,
            validate,
            submit: handleSubmit,
            scrollToField
        };
        const clearCurrValidate = (field) => {
            clearValidate([field]);
        };
        vue.onMounted(() => {
            initDefault();
            emit("register", formActionType);
        });
        return {
            prefixCls: prefixCls2,
            getBindValue,
            handleToggleAdvanced,
            handleEnterPress,
            formModel,
            defaultValueRef,
            advanceState,
            getRow,
            getProps,
            formElRef,
            getSchema,
            formActionType,
            setFormModel,
            getFormClass,
            getToggleClass,
            getFormActionBindProps: vue.computed(
                () => ({ ...getProps.value, ...advanceState })
            ),
            fieldsIsAdvancedMap,
            ...formActionType,
            clearCurrValidate
        };
    }
});
function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FormItem = vue.resolveComponent("FormItem");
    const _component_Row = vue.resolveComponent("Row");
    const _component_FormAction = vue.resolveComponent("FormAction");
    const _component_Form = vue.resolveComponent("Form");
    const _component_DownOutlined = vue.resolveComponent("DownOutlined");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
        vue.createVNode(_component_Form, vue.mergeProps(_ctx.getBindValue, {
            class: _ctx.getFormClass,
            ref: "formElRef",
            model: _ctx.formModel,
            onKeypress: vue.withKeys(_ctx.handleEnterPress, ["enter"])
        }), {
            default: vue.withCtx(() => [
                vue.createVNode(_component_Row, vue.mergeProps(_ctx.getRow, {
                    class: `${_ctx.prefixCls}-input`
                }), {
                    default: vue.withCtx(() => [
                        vue.renderSlot(_ctx.$slots, "formHeader"),
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.getSchema, (schema) => {
                            return vue.openBlock(), vue.createBlock(_component_FormItem, {
                                key: schema.field,
                                isAdvanced: _ctx.fieldsIsAdvancedMap[schema.field],
                                tableAction: _ctx.tableAction,
                                formActionType: _ctx.formActionType,
                                schema,
                                formProps: _ctx.getProps,
                                allDefaultValues: _ctx.defaultValueRef,
                                formModel: _ctx.formModel,
                                setFormModel: _ctx.setFormModel,
                                onClearCurrValidate: _ctx.clearCurrValidate
                            }, vue.createSlots({ _: 2 }, [
                                vue.renderList(Object.keys(_ctx.$slots), (item) => {
                                    return {
                                        name: item,
                                        fn: vue.withCtx((data) => [
                                            vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                                        ])
                                    };
                                })
                            ]), 1032, ["isAdvanced", "tableAction", "formActionType", "schema", "formProps", "allDefaultValues", "formModel", "setFormModel", "onClearCurrValidate"]);
                        }), 128))
                    ]),
                    _: 3
                }, 16, ["class"]),
                vue.createVNode(_component_FormAction, vue.mergeProps({
                    class: `${_ctx.prefixCls}-action`
                }, _ctx.getFormActionBindProps), vue.createSlots({ _: 2 }, [
                    vue.renderList([
                        "resetBefore",
                        "submitBefore",
                        "advanceBefore",
                        "advanceAfter",
                        "advancedSearch"
                    ], (item) => {
                        return {
                            name: item,
                            fn: vue.withCtx((data) => [
                                vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                            ])
                        };
                    })
                ]), 1040, ["class"])
            ]),
            _: 3
        }, 16, ["class", "model", "onKeypress"]),
        vue.renderSlot(_ctx.$slots, "formFooter", {}, () => {
            var _a2, _b;
            return [
                ((_a2 = _ctx.getFormActionBindProps) == null ? void 0 : _a2.showAdvancedButton) && !((_b = _ctx.getFormActionBindProps) == null ? void 0 : _b.hideAdvanceBtn) ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: vue.normalizeClass(`${_ctx.prefixCls}-toggle`)
                }, [
                    vue.createElementVNode("span", {
                        class: vue.normalizeClass(`${_ctx.prefixCls}-toggle-left__line`)
                    }, null, 2),
                    vue.createElementVNode("span", {
                        class: vue.normalizeClass(`${_ctx.prefixCls}-toggle-right__line`)
                    }, null, 2),
                    vue.createElementVNode("span", {
                        class: vue.normalizeClass(_ctx.getToggleClass),
                        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleToggleAdvanced && _ctx.handleToggleAdvanced(...args))
                    }, [
                        vue.createVNode(_component_DownOutlined, { style: { fontSize: "10px", color: "#2991ff " } })
                    ], 2)
                ], 2)) : vue.createCommentVNode("", true)
            ];
        })
    ], 64);
}
const BasicForm = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", _sfc_render$v]]);
const index$6 = "";
function useComponentRegister(compName, comp) {
    add(compName, comp);
    tryOnUnmounted(() => {
        del(compName);
    });
}
function useForm(props2) {
    const formRef = vue.ref(null);
    const loadedRef = vue.ref(false);
    async function getForm() {
        const form = vue.unref(formRef);
        if (!form) {
            utils.error(
                "The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!"
            );
        }
        await vue.nextTick();
        return form;
    }
    function register(instance) {
        vue.onUnmounted(() => {
            formRef.value = null;
            loadedRef.value = null;
        });
        if (vue.unref(loadedRef) && instance === vue.unref(formRef))
            return;
        formRef.value = instance;
        loadedRef.value = true;
        vue.watch(
            () => props2,
            () => {
                props2 && instance.setProps(utils.getDynamicProps(props2));
            },
            {
                immediate: true,
                deep: true
            }
        );
    }
    const methods2 = {
        scrollToField: async (name, options) => {
            const form = await getForm();
            form.scrollToField(name, options);
        },
        setProps: async (formProps) => {
            const form = await getForm();
            form.setProps(formProps);
        },
        updateSchema: async (data) => {
            const form = await getForm();
            form.updateSchema(data);
        },
        resetSchema: async (data) => {
            const form = await getForm();
            form.resetSchema(data);
        },
        clearValidate: async (name) => {
            const form = await getForm();
            form.clearValidate(name);
        },
        resetFields: async () => {
            getForm().then(async (form) => {
                await form.resetFields();
            });
        },
        removeSchemaByField: async (field) => {
            var _a2;
            (_a2 = vue.unref(formRef)) == null ? void 0 : _a2.removeSchemaByField(field);
        },
        // TODO promisify
        getFieldsValue: () => {
            var _a2;
            return (_a2 = vue.unref(formRef)) == null ? void 0 : _a2.getFieldsValue();
        },
        setFieldsValue: async (values) => {
            const form = await getForm();
            form.setFieldsValue(values);
        },
        appendSchemaByField: async (schema, prefixField, first) => {
            const form = await getForm();
            form.appendSchemaByField(schema, prefixField, first);
        },
        submit: async () => {
            const form = await getForm();
            return form.submit();
        },
        validate: async (nameList) => {
            const form = await getForm();
            const value = await form.validate(nameList);
            Object.keys(value).forEach((key2) => {
                if (value[key2] === void 0) {
                    value[key2] = "";
                }
            });
            return value;
        },
        validateFields: async (nameList) => {
            const form = await getForm();
            return form.validateFields(nameList);
        }
    };
    return [register, methods2];
}
var ToolbarEnum = /* @__PURE__ */ ((ToolbarEnum2) => {
    ToolbarEnum2[ToolbarEnum2["SELECT_ALL"] = 0] = "SELECT_ALL";
    ToolbarEnum2[ToolbarEnum2["UN_SELECT_ALL"] = 1] = "UN_SELECT_ALL";
    ToolbarEnum2[ToolbarEnum2["EXPAND_ALL"] = 2] = "EXPAND_ALL";
    ToolbarEnum2[ToolbarEnum2["UN_EXPAND_ALL"] = 3] = "UN_EXPAND_ALL";
    ToolbarEnum2[ToolbarEnum2["CHECK_STRICTLY"] = 4] = "CHECK_STRICTLY";
    ToolbarEnum2[ToolbarEnum2["CHECK_UN_STRICTLY"] = 5] = "CHECK_UN_STRICTLY";
    return ToolbarEnum2;
})(ToolbarEnum || {});
const treeEmits = [
    "update:expandedKeys",
    "update:selectedKeys",
    "update:value",
    "change",
    "check",
    "update:searchValue"
];
const treeProps = utils.buildProps({
    value: {
        type: [Object, Array]
    },
    renderIcon: {
        type: Function
    },
    helpMessage: {
        type: [String, Array],
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    toolbar: Boolean,
    search: Boolean,
    searchValue: {
        type: String,
        default: ""
    },
    checkStrictly: Boolean,
    clickRowToExpand: {
        type: Boolean,
        default: false
    },
    checkable: Boolean,
    defaultExpandLevel: {
        type: [String, Number],
        default: ""
    },
    defaultExpandAll: Boolean,
    fieldNames: {
        type: Object
    },
    treeData: {
        type: Array
    },
    actionList: {
        type: Array,
        default: () => []
    },
    expandedKeys: {
        type: Array,
        default: () => []
    },
    selectedKeys: {
        type: Array,
        default: () => []
    },
    checkedKeys: {
        type: Array,
        default: () => []
    },
    beforeRightClick: {
        type: Function,
        default: void 0
    },
    rightMenuList: {
        type: Array
    },
    // 自定义数据过滤判断方法(注: 不是整个过滤方法，而是内置过滤的判断方法，用于增强原本仅能通过title进行过滤的方式)
    filterFn: {
        type: Function,
        default: void 0
    },
    // 高亮搜索值，仅高亮具体匹配值（通过title）值为true时使用默认色值，值为#xxx时使用此值替代且高亮开启
    highlight: {
        type: [Boolean, String],
        default: false
    },
    // 搜索完成时自动展开结果
    expandOnSearch: Boolean,
    // 搜索完成自动选中所有结果,当且仅当 checkable===true 时生效
    checkOnSearch: Boolean,
    // 搜索完成自动select所有结果
    selectedOnSearch: Boolean,
    loading: {
        type: Boolean,
        default: false
    },
    treeWrapperClassName: String
});
const _hoisted_1$n = {
    key: 2,
    class: "shy-search"
};
const _sfc_main$L = /* @__PURE__ */ vue.defineComponent({
    __name: "TreeHeader",
    props: {
        helpMessage: {
            type: [String, Array],
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        toolbar: {
            type: Boolean,
            default: false
        },
        checkable: {
            type: Boolean,
            default: false
        },
        search: {
            type: Boolean,
            default: false
        },
        searchText: {
            type: String,
            default: ""
        },
        checkAll: {
            type: Function,
            default: void 0
        },
        expandAll: {
            type: Function,
            default: void 0
        }
    },
    emits: ["strictly-change", "search"],
    setup(__props, { emit }) {
        const props2 = __props;
        const searchValue = vue.ref("");
        const [bem] = utils.createBEM("tree-header");
        const slots = vue.useSlots();
        const { t: t2 } = use.useI18n();
        const getInputSearchCls = vue.computed(() => {
            const titleExists = slots.headerTitle || props2.title;
            return [
                "mr-1",
                "w-full",
                {
                    ["ml-5"]: titleExists
                }
            ];
        });
        const toolbarList = vue.computed(() => {
            const { checkable } = props2;
            const defaultToolbarList = [
                { label: t2("component.tree.expandAll"), value: ToolbarEnum.EXPAND_ALL },
                {
                    label: t2("component.tree.unExpandAll"),
                    value: ToolbarEnum.UN_EXPAND_ALL,
                    divider: checkable
                }
            ];
            return checkable ? [
                { label: t2("component.tree.selectAll"), value: ToolbarEnum.SELECT_ALL },
                {
                    label: t2("component.tree.unSelectAll"),
                    value: ToolbarEnum.UN_SELECT_ALL,
                    divider: checkable
                },
                ...defaultToolbarList,
                {
                    label: t2("component.tree.checkStrictly"),
                    value: ToolbarEnum.CHECK_STRICTLY
                },
                {
                    label: t2("component.tree.checkUnStrictly"),
                    value: ToolbarEnum.CHECK_UN_STRICTLY
                }
            ] : defaultToolbarList;
        });
        function handleMenuClick(e) {
            var _a2, _b, _c, _d;
            const { key: key2 } = e;
            switch (key2) {
                case ToolbarEnum.SELECT_ALL:
                    (_a2 = props2.checkAll) == null ? void 0 : _a2.call(props2, true);
                    break;
                case ToolbarEnum.UN_SELECT_ALL:
                    (_b = props2.checkAll) == null ? void 0 : _b.call(props2, false);
                    break;
                case ToolbarEnum.EXPAND_ALL:
                    (_c = props2.expandAll) == null ? void 0 : _c.call(props2, true);
                    break;
                case ToolbarEnum.UN_EXPAND_ALL:
                    (_d = props2.expandAll) == null ? void 0 : _d.call(props2, false);
                    break;
                case ToolbarEnum.CHECK_STRICTLY:
                    emit("strictly-change", false);
                    break;
                case ToolbarEnum.CHECK_UN_STRICTLY:
                    emit("strictly-change", true);
                    break;
            }
        }
        function emitChange(value) {
            emit("search", value);
        }
        const debounceEmitChange = useDebounceFn$1(emitChange, 200);
        vue.watch(
            () => searchValue.value,
            (v) => {
                debounceEmitChange(v);
            }
        );
        vue.watch(
            () => props2.searchText,
            (v) => {
                if (v !== searchValue.value) {
                    searchValue.value = v;
                }
            }
        );
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
                class: vue.normalizeClass(vue.unref(bem)())
            }, [
                vue.unref(slots).headerTitle ? vue.renderSlot(_ctx.$slots, "headerTitle", { key: 0 }, void 0, true) : vue.createCommentVNode("", true),
                !vue.unref(slots).headerTitle && _ctx.title ? (vue.openBlock(), vue.createBlock(vue.unref(BasicTitle$1), {
                    key: 1,
                    helpMessage: _ctx.helpMessage
                }, {
                    default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
                    ]),
                    _: 1
                }, 8, ["helpMessage"])) : vue.createCommentVNode("", true),
                _ctx.search || _ctx.toolbar ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$n, [
                    _ctx.search ? (vue.openBlock(), vue.createElementBlock("div", {
                        key: 0,
                        class: vue.normalizeClass(vue.unref(getInputSearchCls))
                    }, [
                        vue.createVNode(vue.unref(antDesignVue.Input), {
                            placeholder: vue.unref(t2)("common.searchText"),
                            allowClear: "",
                            value: searchValue.value,
                            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => searchValue.value = $event)
                        }, null, 8, ["placeholder", "value"])
                    ], 2)) : vue.createCommentVNode("", true),
                    _ctx.toolbar ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Dropdown), {
                        key: 1,
                        onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
                        }, ["prevent"]))
                    }, {
                        overlay: vue.withCtx(() => [
                            vue.createVNode(vue.unref(antDesignVue.Menu), { onClick: handleMenuClick }, {
                                default: vue.withCtx(() => [
                                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(toolbarList), (item) => {
                                        return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                                            key: item.value
                                        }, [
                                            vue.createVNode(vue.unref(antDesignVue.MenuItem), vue.normalizeProps(vue.guardReactiveProps({ key: item.value })), {
                                                default: vue.withCtx(() => [
                                                    vue.createTextVNode(vue.toDisplayString(item.label), 1)
                                                ]),
                                                _: 2
                                            }, 1040),
                                            item.divider ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.MenuDivider), { key: 0 })) : vue.createCommentVNode("", true)
                                        ], 64);
                                    }), 128))
                                ]),
                                _: 1
                            })
                        ]),
                        default: vue.withCtx(() => [
                            vue.createVNode(vue.unref(Icon2), { icon: "ion:ellipsis-vertical" })
                        ]),
                        _: 1
                    })) : vue.createCommentVNode("", true)
                ])) : vue.createCommentVNode("", true)
            ], 2);
        };
    }
});
const TreeHeader_vue_vue_type_style_index_0_scoped_6d3f2554_lang = "";
const TreeHeader = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["__scopeId", "data-v-6d3f2554"]]);
process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" ? Object.freeze([]) : [];
const isString = (val) => typeof val === "string";
const TreeIcon = ({
                      icon
                  }) => {
    if (!icon)
        return null;
    if (isString(icon)) {
        return vue.h(Icon2, { icon, class: "mr-1" });
    }
    return Icon2;
};
function useTree(treeDataRef, getFieldNames) {
    function getAllKeys2(list) {
        const keys2 = [];
        const treeData = list || vue.unref(treeDataRef);
        const { key: keyField, children: childrenField } = vue.unref(getFieldNames);
        if (!childrenField || !keyField)
            return keys2;
        for (let index2 = 0; index2 < treeData.length; index2++) {
            const node = treeData[index2];
            keys2.push(node[keyField]);
            const children = node[childrenField];
            if (children && children.length) {
                keys2.push(...getAllKeys2(children));
            }
        }
        return keys2;
    }
    function getEnabledKeys(list) {
        const keys2 = [];
        const treeData = list || vue.unref(treeDataRef);
        const { key: keyField, children: childrenField } = vue.unref(getFieldNames);
        if (!childrenField || !keyField)
            return keys2;
        for (let index2 = 0; index2 < treeData.length; index2++) {
            const node = treeData[index2];
            node.disabled !== true && node.selectable !== false && keys2.push(node[keyField]);
            const children = node[childrenField];
            if (children && children.length) {
                keys2.push(...getEnabledKeys(children));
            }
        }
        return keys2;
    }
    function getChildrenKeys(nodeKey, list) {
        const keys2 = [];
        const treeData = list || vue.unref(treeDataRef);
        const { key: keyField, children: childrenField } = vue.unref(getFieldNames);
        if (!childrenField || !keyField)
            return keys2;
        for (let index2 = 0; index2 < treeData.length; index2++) {
            const node = treeData[index2];
            const children = node[childrenField];
            if (nodeKey === node[keyField]) {
                keys2.push(node[keyField]);
                if (children && children.length) {
                    keys2.push(...getAllKeys2(children));
                }
            } else {
                if (children && children.length) {
                    keys2.push(...getChildrenKeys(nodeKey, children));
                }
            }
        }
        return keys2;
    }
    function updateNodeByKey(key2, node, list) {
        if (!key2)
            return;
        const treeData = list || vue.unref(treeDataRef);
        const { key: keyField, children: childrenField } = vue.unref(getFieldNames);
        if (!childrenField || !keyField)
            return;
        for (let index2 = 0; index2 < treeData.length; index2++) {
            const element = treeData[index2];
            const children = element[childrenField];
            if (element[keyField] === key2) {
                treeData[index2] = { ...treeData[index2], ...node };
                break;
            } else if (children && children.length) {
                updateNodeByKey(key2, node, element[childrenField]);
            }
        }
    }
    function filterByLevel(level = 1, list, currentLevel = 1) {
        if (!level) {
            return [];
        }
        const res = [];
        const data = list || vue.unref(treeDataRef) || [];
        for (let index2 = 0; index2 < data.length; index2++) {
            const item = data[index2];
            const { key: keyField, children: childrenField } = vue.unref(getFieldNames);
            const key2 = keyField ? item[keyField] : "";
            const children = childrenField ? item[childrenField] : [];
            res.push(key2);
            if (children && children.length && currentLevel < level) {
                currentLevel += 1;
                res.push(...filterByLevel(level, children, currentLevel));
            }
        }
        return res;
    }
    function insertNodeByKey({
                                 parentKey = null,
                                 node,
                                 push = "push"
                             }) {
        const treeData = cloneDeep(vue.unref(treeDataRef));
        if (!parentKey) {
            treeData[push](node);
            treeDataRef.value = treeData;
            return;
        }
        const { key: keyField, children: childrenField } = vue.unref(getFieldNames);
        if (!childrenField || !keyField)
            return;
        utils.forEach(treeData, (treeItem) => {
            if (treeItem[keyField] === parentKey) {
                treeItem[childrenField] = treeItem[childrenField] || [];
                treeItem[childrenField][push](node);
                return true;
            }
        });
        treeDataRef.value = treeData;
    }
    function insertNodesByKey({
                                  parentKey = null,
                                  list,
                                  push = "push"
                              }) {
        const treeData = cloneDeep(vue.unref(treeDataRef));
        if (!list || list.length < 1) {
            return;
        }
        if (!parentKey) {
            for (let i = 0; i < list.length; i++) {
                treeData[push](list[i]);
            }
        } else {
            const { key: keyField, children: childrenField } = vue.unref(getFieldNames);
            if (!childrenField || !keyField)
                return;
            utils.forEach(treeData, (treeItem) => {
                if (treeItem[keyField] === parentKey) {
                    treeItem[childrenField] = treeItem[childrenField] || [];
                    for (let i = 0; i < list.length; i++) {
                        treeItem[childrenField][push](list[i]);
                    }
                    treeDataRef.value = treeData;
                    return true;
                }
            });
        }
    }
    function deleteNodeByKey(key2, list) {
        if (!key2)
            return;
        const treeData = list || vue.unref(treeDataRef);
        const { key: keyField, children: childrenField } = vue.unref(getFieldNames);
        if (!childrenField || !keyField)
            return;
        for (let index2 = 0; index2 < treeData.length; index2++) {
            const element = treeData[index2];
            const children = element[childrenField];
            if (element[keyField] === key2) {
                treeData.splice(index2, 1);
                break;
            } else if (children && children.length) {
                deleteNodeByKey(key2, element[childrenField]);
            }
        }
    }
    function getSelectedNode(key2, list, selectedNode) {
        if (!key2 && key2 !== 0)
            return null;
        const treeData = list || vue.unref(treeDataRef);
        treeData.forEach((item) => {
            if ((selectedNode == null ? void 0 : selectedNode.key) || (selectedNode == null ? void 0 : selectedNode.key) === 0)
                return selectedNode;
            if (item.key === key2) {
                selectedNode = item;
                return;
            }
            if (item.children && item.children.length) {
                selectedNode = getSelectedNode(key2, item.children, selectedNode);
            }
        });
        return selectedNode || null;
    }
    return {
        deleteNodeByKey,
        insertNodeByKey,
        insertNodesByKey,
        filterByLevel,
        updateNodeByKey,
        getAllKeys: getAllKeys2,
        getChildrenKeys,
        getEnabledKeys,
        getSelectedNode
    };
}
function _isSlot$1(s) {
    return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const prefixCls$1 = "context-menu";
const props$4 = {
    width: {
        type: Number,
        default: 156
    },
    customEvent: {
        type: Object,
        default: null
    },
    styles: {
        type: Object
    },
    showIcon: {
        type: Boolean,
        default: true
    },
    axis: {
        // The position of the right mouse button click
        type: Object,
        default() {
            return {
                x: 0,
                y: 0
            };
        }
    },
    items: {
        // The most important list, if not, will not be displayed
        type: Array,
        default() {
            return [];
        }
    }
};
const ItemContent = (props2) => {
    const {
        item
    } = props2;
    return vue.createVNode("span", {
        "style": "display: inline-block; width: 100%; ",
        "class": "px-4",
        "onClick": props2.handler.bind(null, item)
    }, [props2.showIcon && item.icon && vue.createVNode(Icon2, {
        "class": "mr-2",
        "icon": item.icon
    }, null), vue.createVNode("span", null, [item.label])]);
};
const _sfc_main$K = /* @__PURE__ */ vue.defineComponent({
    name: "ContextMenu",
    props: props$4,
    setup(props2) {
        const wrapRef = vue.ref(null);
        const showRef = vue.ref(false);
        const getStyle = vue.computed(() => {
            const {
                axis,
                items,
                styles,
                width
            } = props2;
            const {
                x,
                y
            } = axis || {
                x: 0,
                y: 0
            };
            const menuHeight = (items || []).length * 40;
            const menuWidth = width;
            const body = document.body;
            const left = body.clientWidth < x + menuWidth ? x - menuWidth : x;
            const top = body.clientHeight < y + menuHeight ? y - menuHeight : y;
            return {
                ...styles,
                position: "absolute",
                width: `${width}px`,
                left: `${left + 1}px`,
                top: `${top + 1}px`,
                zIndex: 9999
            };
        });
        vue.onMounted(() => {
            vue.nextTick(() => showRef.value = true);
        });
        vue.onUnmounted(() => {
            const el = vue.unref(wrapRef);
            el && document.body.removeChild(el);
        });
        function handleAction(item, e) {
            const {
                handler,
                disabled
            } = item;
            if (disabled) {
                return;
            }
            showRef.value = false;
            e == null ? void 0 : e.stopPropagation();
            e == null ? void 0 : e.preventDefault();
            handler == null ? void 0 : handler();
        }
        function renderMenuItem(items) {
            const visibleItems = items.filter((item) => !item.hidden);
            return visibleItems.map((item) => {
                const {
                    disabled,
                    label,
                    children,
                    divider = false
                } = item;
                const contentProps = {
                    item,
                    handler: handleAction,
                    showIcon: props2.showIcon
                };
                if (!children || children.length === 0) {
                    return vue.createVNode(vue.Fragment, null, [vue.createVNode(antDesignVue.Menu.Item, {
                        "disabled": disabled,
                        "class": `${prefixCls$1}__item`,
                        "key": label
                    }, {
                        default: () => [vue.createVNode(ItemContent, contentProps, null)]
                    }), divider ? vue.createVNode(antDesignVue.Divider, {
                        "key": `d-${label}`
                    }, null) : null]);
                }
                if (!vue.unref(showRef))
                    return null;
                return vue.createVNode(antDesignVue.Menu.SubMenu, {
                    "key": label,
                    "disabled": disabled,
                    "popupClassName": `${prefixCls$1}__popup`
                }, {
                    title: () => vue.createVNode(ItemContent, contentProps, null),
                    default: () => renderMenuItem(children)
                });
            });
        }
        return () => {
            let _slot;
            if (!vue.unref(showRef)) {
                return null;
            }
            const {
                items
            } = props2;
            return vue.createVNode("div", {
                "class": prefixCls$1
            }, [vue.createVNode(antDesignVue.Menu, {
                "inlineIndent": 12,
                "mode": "vertical",
                "ref": wrapRef,
                "style": vue.unref(getStyle)
            }, _isSlot$1(_slot = renderMenuItem(items)) ? _slot : {
                default: () => [_slot]
            })]);
        };
    }
});
const ContextMenu_vue_vue_type_style_index_0_lang = "";
const menuManager = {
    domList: [],
    resolve: () => {
    }
};
const createContextMenu = function(options) {
    const { event } = options || {};
    event && (event == null ? void 0 : event.preventDefault());
    if (!utils.isClient) {
        return;
    }
    return new Promise((resolve) => {
        const body = document.body;
        const container = document.createElement("div");
        const propsData = {};
        if (options.styles) {
            propsData.styles = options.styles;
        }
        if (options.items) {
            propsData.items = options.items;
        }
        if (options.event) {
            propsData.customEvent = event;
            propsData.axis = { x: event.clientX, y: event.clientY };
        }
        const vm = vue.createVNode(_sfc_main$K, propsData);
        vue.render(vm, container);
        const handleClick = function() {
            menuManager.resolve("");
        };
        menuManager.domList.push(container);
        const remove = function() {
            menuManager.domList.forEach((dom) => {
                try {
                    dom && body.removeChild(dom);
                } catch (error2) {
                }
            });
            body.removeEventListener("click", handleClick);
            body.removeEventListener("scroll", handleClick);
        };
        menuManager.resolve = function(arg) {
            remove();
            resolve(arg);
        };
        remove();
        body.appendChild(container);
        body.addEventListener("click", handleClick);
        body.addEventListener("scroll", handleClick);
    });
};
const destroyContextMenu = function() {
    if (menuManager) {
        menuManager.resolve("");
        menuManager.domList = [];
    }
};
function useContextMenu(authRemove = true) {
    if (vue.getCurrentInstance() && authRemove) {
        vue.onUnmounted(() => {
            destroyContextMenu();
        });
    }
    return [createContextMenu, destroyContextMenu];
}
function _isSlot(s) {
    return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const _sfc_main$J = /* @__PURE__ */ vue.defineComponent({
    name: "BasicTree",
    inheritAttrs: false,
    props: treeProps,
    emits: treeEmits,
    setup(props2, {
        attrs,
        slots,
        emit,
        expose
    }) {
        const [bem] = utils.createBEM("tree");
        const state = vue.reactive({
            checkStrictly: props2.checkStrictly,
            expandedKeys: props2.expandedKeys || [],
            selectedKeys: props2.selectedKeys || [],
            checkedKeys: props2.checkedKeys || []
        });
        const searchState = vue.reactive({
            startSearch: false,
            searchText: "",
            searchData: []
        });
        const treeDataRef = vue.ref([]);
        const [createContextMenu2] = useContextMenu();
        const getFieldNames = vue.computed(() => {
            const {
                fieldNames
            } = props2;
            return {
                children: "children",
                title: "title",
                key: "key",
                ...fieldNames
            };
        });
        const getBindValues = vue.computed(() => {
            let propsData = {
                blockNode: true,
                ...attrs,
                ...props2,
                expandedKeys: state.expandedKeys,
                selectedKeys: state.selectedKeys,
                checkedKeys: state.checkedKeys,
                checkStrictly: state.checkStrictly,
                fieldNames: vue.unref(getFieldNames),
                "onUpdate:expandedKeys": (v) => {
                    state.expandedKeys = v;
                    emit("update:expandedKeys", v);
                },
                "onUpdate:selectedKeys": (v) => {
                    state.selectedKeys = v;
                    emit("update:selectedKeys", v);
                },
                onCheck: (v, e) => {
                    let currentValue = vue.toRaw(state.checkedKeys);
                    if (utils.isArray(currentValue) && searchState.startSearch) {
                        const value = e.node.eventKey;
                        currentValue = difference$1(currentValue, getChildrenKeys(value));
                        if (e.checked) {
                            currentValue.push(value);
                        }
                        state.checkedKeys = currentValue;
                    } else {
                        state.checkedKeys = v;
                    }
                    const rawVal = vue.toRaw(state.checkedKeys);
                    emit("update:value", rawVal);
                    emit("check", rawVal, e);
                },
                onRightClick: handleRightClick
            };
            return omit$1(propsData, "treeData", "class");
        });
        const getTreeData = vue.computed(() => searchState.startSearch ? searchState.searchData : vue.unref(treeDataRef));
        const getNotFound = vue.computed(() => {
            return !getTreeData.value || getTreeData.value.length === 0;
        });
        const {
            deleteNodeByKey,
            insertNodeByKey,
            insertNodesByKey,
            filterByLevel,
            updateNodeByKey,
            getAllKeys: getAllKeys2,
            getChildrenKeys,
            getEnabledKeys,
            getSelectedNode
        } = useTree(treeDataRef, getFieldNames);
        function getIcon(params, icon) {
            if (!icon) {
                if (props2.renderIcon && utils.isFunction(props2.renderIcon)) {
                    return props2.renderIcon(params);
                }
            }
            return icon;
        }
        async function handleRightClick({
                                            event,
                                            node
                                        }) {
            var _a2;
            const {
                rightMenuList: menuList = [],
                beforeRightClick
            } = props2;
            let contextMenuOptions = {
                event,
                items: []
            };
            if (beforeRightClick && utils.isFunction(beforeRightClick)) {
                let result = await beforeRightClick(node, event);
                if (Array.isArray(result)) {
                    contextMenuOptions.items = result;
                } else {
                    Object.assign(contextMenuOptions, result);
                }
            } else {
                contextMenuOptions.items = menuList;
            }
            if (!((_a2 = contextMenuOptions.items) == null ? void 0 : _a2.length))
                return;
            contextMenuOptions.items = contextMenuOptions.items.filter((item) => !item.hidden);
            createContextMenu2(contextMenuOptions);
        }
        function setExpandedKeys(keys2) {
            state.expandedKeys = keys2;
        }
        function getExpandedKeys() {
            return state.expandedKeys;
        }
        function setSelectedKeys(keys2) {
            state.selectedKeys = keys2;
        }
        function getSelectedKeys() {
            return state.selectedKeys;
        }
        function setCheckedKeys(keys2) {
            state.checkedKeys = keys2;
        }
        function getCheckedKeys() {
            return state.checkedKeys;
        }
        function checkAll(checkAll2) {
            state.checkedKeys = checkAll2 ? getEnabledKeys() : [];
        }
        function expandAll(expandAll2) {
            state.expandedKeys = expandAll2 ? getAllKeys2() : [];
        }
        function onStrictlyChange(strictly) {
            state.checkStrictly = strictly;
        }
        vue.watch(() => props2.searchValue, (val) => {
            if (val !== searchState.searchText) {
                searchState.searchText = val;
            }
        }, {
            immediate: true
        });
        vue.watch(() => props2.treeData, (val) => {
            if (val) {
                handleSearch(searchState.searchText);
            }
        });
        function handleSearch(searchValue) {
            if (searchValue !== searchState.searchText)
                searchState.searchText = searchValue;
            emit("update:searchValue", searchValue);
            if (!searchValue) {
                searchState.startSearch = false;
                return;
            }
            const {
                filterFn,
                checkable,
                expandOnSearch,
                checkOnSearch,
                selectedOnSearch
            } = vue.unref(props2);
            searchState.startSearch = true;
            const {
                title: titleField,
                key: keyField
            } = vue.unref(getFieldNames);
            const matchedKeys = [];
            searchState.searchData = utils.filter(vue.unref(treeDataRef), (node) => {
                var _a2;
                const result = filterFn ? filterFn(searchValue, node, vue.unref(getFieldNames)) : ((_a2 = node[titleField]) == null ? void 0 : _a2.includes(searchValue)) ?? false;
                if (result) {
                    matchedKeys.push(node[keyField]);
                }
                return result;
            }, vue.unref(getFieldNames));
            if (expandOnSearch) {
                const expandKeys = utils.treeToList(searchState.searchData).map((val) => {
                    return val[keyField];
                });
                if (expandKeys && expandKeys.length) {
                    setExpandedKeys(expandKeys);
                }
            }
            if (checkOnSearch && checkable && matchedKeys.length) {
                setCheckedKeys(matchedKeys);
            }
            if (selectedOnSearch && matchedKeys.length) {
                setSelectedKeys(matchedKeys);
            }
        }
        function handleClickNode(key2, children) {
            if (!props2.clickRowToExpand || !children || children.length === 0)
                return;
            if (!state.expandedKeys.includes(key2)) {
                setExpandedKeys([...state.expandedKeys, key2]);
            } else {
                const keys2 = [...state.expandedKeys];
                const index2 = keys2.findIndex((item) => item === key2);
                if (index2 !== -1) {
                    keys2.splice(index2, 1);
                }
                setExpandedKeys(keys2);
            }
        }
        vue.watchEffect(() => {
            treeDataRef.value = props2.treeData;
        });
        vue.onMounted(() => {
            const level = parseInt(props2.defaultExpandLevel);
            if (level > 0) {
                state.expandedKeys = filterByLevel(level);
            } else if (props2.defaultExpandAll) {
                expandAll(true);
            }
        });
        vue.watchEffect(() => {
            state.expandedKeys = props2.expandedKeys;
        });
        vue.watchEffect(() => {
            state.selectedKeys = props2.selectedKeys;
        });
        vue.watchEffect(() => {
            state.checkedKeys = props2.checkedKeys;
        });
        vue.watch(() => props2.value, () => {
            state.checkedKeys = vue.toRaw(props2.value || []);
        }, {
            immediate: true
        });
        vue.watch(() => state.checkedKeys, () => {
            const v = vue.toRaw(state.checkedKeys);
            emit("update:value", v);
            emit("change", v);
        });
        vue.watchEffect(() => {
            state.checkStrictly = props2.checkStrictly;
        });
        const instance = {
            setExpandedKeys,
            getExpandedKeys,
            setSelectedKeys,
            getSelectedKeys,
            setCheckedKeys,
            getCheckedKeys,
            insertNodeByKey,
            insertNodesByKey,
            deleteNodeByKey,
            updateNodeByKey,
            getSelectedNode,
            checkAll,
            expandAll,
            filterByLevel: (level) => {
                state.expandedKeys = filterByLevel(level);
            },
            setSearchValue: (value) => {
                handleSearch(value);
            },
            getSearchValue: () => {
                return searchState.searchText;
            }
        };
        function renderAction(node) {
            const {
                actionList
            } = props2;
            if (!actionList || actionList.length === 0)
                return;
            return actionList.map((item, index2) => {
                var _a2;
                let nodeShow = true;
                if (utils.isFunction(item.show)) {
                    nodeShow = (_a2 = item.show) == null ? void 0 : _a2.call(item, node);
                } else if (utils.isBoolean(item.show)) {
                    nodeShow = item.show;
                }
                if (!nodeShow)
                    return null;
                return vue.createVNode("span", {
                    "key": index2,
                    "class": bem("action")
                }, [item.render(node)]);
            });
        }
        const treeData = vue.computed(() => {
            const data = cloneDeep(getTreeData.value);
            utils.eachTree(data, (item, _parent) => {
                var _a2;
                const searchText = searchState.searchText;
                const {
                    highlight
                } = vue.unref(props2);
                const {
                    title: titleField,
                    key: keyField,
                    children: childrenField
                } = vue.unref(getFieldNames);
                const icon = getIcon(item, item.icon);
                const title = get(item, titleField);
                const searchIdx = searchText ? title.indexOf(searchText) : -1;
                const isHighlight = searchState.startSearch && !utils.isEmpty(searchText) && highlight && searchIdx !== -1;
                const highlightStyle = `color: ${utils.isBoolean(highlight) ? "#f50" : highlight}`;
                const titleDom = isHighlight ? vue.createVNode("span", {
                    "class": ((_a2 = vue.unref(getBindValues)) == null ? void 0 : _a2.blockNode) ? `${bem("content")}` : ""
                }, [vue.createVNode("span", null, [title.substr(0, searchIdx)]), vue.createVNode("span", {
                    "style": highlightStyle
                }, [searchText]), vue.createVNode("span", null, [title.substr(searchIdx + searchText.length)])]) : title;
                item[titleField] = vue.createVNode("span", {
                    "class": `${bem("title")} pl-2`,
                    "onClick": handleClickNode.bind(null, item[keyField], item[childrenField])
                }, [(slots == null ? void 0 : slots.title) ? utils.getSlot(slots, "title", item) : vue.createVNode(vue.Fragment, null, [icon && vue.createVNode(TreeIcon, {
                    "icon": icon
                }, null), titleDom, vue.createVNode("span", {
                    "class": bem("actions")
                }, [renderAction(item)])])]);
                return item;
            });
            return data;
        });
        expose(instance);
        return () => {
            let _slot;
            const {
                title,
                helpMessage,
                toolbar,
                search,
                checkable
            } = props2;
            const showTitle = title || toolbar || search || slots.headerTitle;
            const scrollStyle = {
                height: "calc(100% - 38px)"
            };
            return vue.createVNode("div", {
                "class": [bem(), "h-full", attrs.class]
            }, [showTitle && vue.createVNode(TreeHeader, {
                "checkable": checkable,
                "checkAll": checkAll,
                "expandAll": expandAll,
                "title": title,
                "search": search,
                "toolbar": toolbar,
                "helpMessage": helpMessage,
                "onStrictlyChange": onStrictlyChange,
                "onSearch": handleSearch,
                "searchText": searchState.searchText
            }, _isSlot(_slot = utils.extendSlots(slots)) ? _slot : {
                default: () => [_slot]
            }), vue.createVNode(antDesignVue.Spin, {
                "wrapperClassName": vue.unref(props2.treeWrapperClassName),
                "spinning": vue.unref(props2.loading),
                "tip": "加载中..."
            }, {
                default: () => [vue.withDirectives(vue.createVNode(ScrollContainer$1, {
                    "style": scrollStyle
                }, {
                    default: () => [vue.createVNode(antDesignVue.Tree, vue.mergeProps(vue.unref(getBindValues), {
                        "showIcon": false,
                        "treeData": treeData.value
                    }), null)]
                }), [[vue.vShow, !vue.unref(getNotFound)]]), vue.withDirectives(vue.createVNode(antDesignVue.Empty, {
                    "image": antDesignVue.Empty.PRESENTED_IMAGE_SIMPLE,
                    "class": "!mt-4"
                }, null), [[vue.vShow, vue.unref(getNotFound)]])]
            })]);
        };
    }
});
const index$5 = "";
const _sfc_main$I = /* @__PURE__ */ vue.defineComponent({
    __name: "DeptTree",
    props: {
        api: {
            default: () => {
                return () => new Promise(
                    (resolve) => resolve([
                        {
                            title: "father",
                            key: "1",
                            children: [{ title: "1-son", key: "1-1" }]
                        },
                        {
                            title: "father2",
                            key: "2",
                            children: [{ title: "2-son", key: "2-1" }]
                        }
                    ])
                );
            }
        },
        fieldNames: {
            default: () => ({ label: "title", value: "key" })
        }
    },
    emits: ["select"],
    setup(__props, { expose, emit }) {
        const props2 = __props;
        const treeData = vue.ref([]);
        const searchToolbar = vue.ref(false);
        async function fetch() {
            const res = await props2.api();
            treeData.value = res;
        }
        function handleSelect(keys2) {
            emit("select", keys2[0]);
        }
        const reload = async () => {
            await fetch();
        };
        vue.onMounted(() => {
            fetch();
        });
        expose({ reload });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(_sfc_main$J), {
                title: "",
                toolbar: searchToolbar.value,
                search: "",
                clickRowToExpand: false,
                treeData: treeData.value,
                fieldNames: props2.fieldNames,
                onSelect: handleSelect
            }, null, 8, ["toolbar", "treeData", "fieldNames"]);
        };
    }
});
const _sfc_main$H = vue.defineComponent({
    name: "PageFooter",
    inheritAttrs: false,
    setup() {
        const prefixCls2 = "shy-page-footer";
        const getCalcContentWidth = "300px";
        return { prefixCls: prefixCls2, getCalcContentWidth };
    }
});
const PageFooter_vue_vue_type_style_index_0_scoped_44a47dbd_lang = "";
function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(_ctx.prefixCls),
        style: vue.normalizeStyle({ width: _ctx.getCalcContentWidth })
    }, [
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}__left`)
        }, [
            vue.renderSlot(_ctx.$slots, "left", {}, void 0, true)
        ], 2),
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}__right`)
        }, [
            vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
        ], 2)
    ], 6);
}
const PageFooter = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$u], ["__scopeId", "data-v-44a47dbd"]]);
const _sfc_main$G = vue.defineComponent({
    name: "PageWrapper",
    components: { PageFooter, PageHeader: antDesignVue.PageHeader },
    inheritAttrs: false,
    props: {
        title: {
            type: String
        },
        dense: {
            type: Boolean
        },
        ghost: {
            type: Boolean
        },
        content: {
            type: String
        },
        contentStyle: {
            type: Object
        },
        contentBackground: {
            type: Boolean
        },
        contentFullHeight: {
            type: Boolean
        },
        contentClass: {
            type: String
        },
        fixedHeight: {
            type: Boolean
        },
        upwardSpace: {
            type: Object
        }
    },
    setup(props2, { slots, attrs }) {
        const wrapperRef = vue.ref(null);
        const headerRef = vue.ref(null);
        const contentRef = vue.ref(null);
        const footerRef = vue.ref(null);
        const prefixCls2 = "shy-page-wrapper";
        vue.provide(
            PageWrapperFixedHeightKey,
            vue.computed(() => props2.fixedHeight)
        );
        const getIsContentFullHeight = vue.computed(() => {
            return props2.contentFullHeight;
        });
        const getUpwardSpace = vue.computed(() => props2.upwardSpace);
        const { redoHeight, setCompensation, contentHeight } = use.useContentHeight(
            getIsContentFullHeight,
            wrapperRef,
            [headerRef, footerRef],
            [contentRef],
            getUpwardSpace
        );
        setCompensation({ useLayoutFooter: true, elements: [footerRef] });
        const getClass = vue.computed(() => {
            return [
                prefixCls2,
                {
                    [`${prefixCls2}--dense`]: props2.dense
                },
                attrs.class ?? {}
            ];
        });
        const getShowHeader = vue.computed(
            () => props2.content || (slots == null ? void 0 : slots.headerContent) || props2.title || getHeaderSlots.value.length
        );
        const getShowFooter = vue.computed(
            () => (slots == null ? void 0 : slots.leftFooter) || (slots == null ? void 0 : slots.rightFooter)
        );
        const getHeaderSlots = vue.computed(() => {
            return Object.keys(
                omit$1(slots, "default", "leftFooter", "rightFooter", "headerContent")
            );
        });
        const getContentStyle = vue.computed(() => {
            const { contentFullHeight, contentStyle, fixedHeight } = props2;
            if (!contentFullHeight) {
                return { ...contentStyle };
            }
            const height = `${vue.unref(contentHeight)}px`;
            return {
                ...contentStyle,
                minHeight: height,
                ...fixedHeight ? { height } : {}
            };
        });
        const getContentClass = vue.computed(() => {
            const { contentBackground, contentClass } = props2;
            return [
                `${prefixCls2}-content`,
                contentClass,
                {
                    [`${prefixCls2}-content-bg`]: contentBackground
                }
            ];
        });
        vue.watch(
            () => [getShowFooter.value],
            () => {
                redoHeight();
            },
            {
                flush: "post",
                immediate: true
            }
        );
        return {
            getContentStyle,
            wrapperRef,
            headerRef,
            contentRef,
            footerRef,
            getClass,
            getHeaderSlots,
            prefixCls: prefixCls2,
            getShowHeader,
            getShowFooter,
            omit: omit$1,
            getContentClass
        };
    }
});
const PageWrapper_vue_vue_type_style_index_0_lang = "";
function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_PageHeader = vue.resolveComponent("PageHeader");
    const _component_PageFooter = vue.resolveComponent("PageFooter");
    return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(_ctx.getClass),
        ref: "wrapperRef"
    }, [
        _ctx.getShowHeader ? (vue.openBlock(), vue.createBlock(_component_PageHeader, vue.mergeProps({
            key: 0,
            ghost: _ctx.ghost,
            title: _ctx.title
        }, _ctx.omit(_ctx.$attrs, "class"), { ref: "headerRef" }), vue.createSlots({
            default: vue.withCtx(() => [
                _ctx.content ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    vue.createTextVNode(vue.toDisplayString(_ctx.content), 1)
                ], 64)) : vue.renderSlot(_ctx.$slots, "headerContent", { key: 1 })
            ]),
            _: 2
        }, [
            vue.renderList(_ctx.getHeaderSlots, (item) => {
                return {
                    name: item,
                    fn: vue.withCtx((data) => [
                        vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                    ])
                };
            })
        ]), 1040, ["ghost", "title"])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
            class: vue.normalizeClass(["overflow-hidden", _ctx.getContentClass]),
            style: vue.normalizeStyle(_ctx.getContentStyle),
            ref: "contentRef"
        }, [
            vue.renderSlot(_ctx.$slots, "default")
        ], 6),
        _ctx.getShowFooter ? (vue.openBlock(), vue.createBlock(_component_PageFooter, {
            key: 1,
            ref: "footerRef"
        }, {
            left: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "leftFooter")
            ]),
            right: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "rightFooter")
            ]),
            _: 3
        }, 512)) : vue.createCommentVNode("", true)
    ], 2);
}
const PageWrapper = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$t]]);
const prefixCls = "shy-basic-page-second";
const PageSecond = /* @__PURE__ */ vue.defineComponent({
    props: {
        title: {
            type: String,
            default: () => "Title"
        },
        isShowCancelButton: {
            type: Boolean,
            default: () => true
        },
        isShowConfirmButton: {
            type: Boolean,
            default: () => true
        },
        isShowFooter: {
            type: Boolean,
            default: () => false
        },
        confirmButtonText: {
            type: String,
            default: () => "确定"
        },
        cancelButtonText: {
            type: String,
            default: () => "取消"
        }
    },
    emits: ["click-return", "confirm", "cancel"],
    setup(props2, {
        slots,
        emit
    }) {
        const handleClick = () => {
            emit("click-return");
        };
        const handleCancel = () => {
            emit("cancel");
        };
        const handleConfirm = () => {
            emit("confirm");
        };
        return () => {
            var _a2;
            return vue.createVNode("div", {
                "class": `${prefixCls}-wrapper`
            }, [vue.createVNode("div", {
                "class": `${prefixCls}-header`
            }, [vue.createVNode(ArrowLeftOutlined$1, {
                "class": `${prefixCls}-header-icon`,
                "onClick": handleClick
            }, null), vue.createVNode("div", {
                "class": `${prefixCls}-header-title`
            }, [vue.createVNode("div", {
                "style": "margin-right:10px"
            }, [(slots == null ? void 0 : slots.title) ? slots == null ? void 0 : slots.title() : props2.title]), (slots == null ? void 0 : slots.titleAfter) ? slots == null ? void 0 : slots.titleAfter() : null])]), vue.createVNode("div", {
                "class": `${prefixCls}-body`
            }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)]), props2.isShowFooter ? vue.createVNode("div", {
                "class": `${prefixCls}-footer`
            }, [vue.createVNode(antDesignVue.Space, null, {
                default: () => {
                    var _a3, _b, _c;
                    return [(_a3 = slots.beforeConfirmButton) == null ? void 0 : _a3.call(slots), props2.isShowConfirmButton ? vue.createVNode(_sfc_main$Y, {
                        "onClick": handleConfirm,
                        "type": "primary"
                    }, {
                        default: () => [props2.confirmButtonText]
                    }) : null, (_b = slots.beforeCancelButton) == null ? void 0 : _b.call(slots), props2.isShowCancelButton ? vue.createVNode(_sfc_main$Y, {
                        "onClick": handleCancel
                    }, {
                        default: () => [props2.cancelButtonText]
                    }) : null, (_c = slots.afterCancelButton) == null ? void 0 : _c.call(slots)];
                }
            })]) : null]);
        };
    }
});
const index$4 = "";
const PageWrapperFixedHeightKey = "PageWrapperFixedHeight";
const _sfc_main$F = vue.defineComponent({
    name: "EditTableHeaderIcon",
    components: { FormOutlined: FormOutlined$1 },
    props: { title: { type: String, default: "" } }
});
function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FormOutlined = vue.resolveComponent("FormOutlined");
    return vue.openBlock(), vue.createElementBlock("span", null, [
        vue.renderSlot(_ctx.$slots, "default"),
        vue.createTextVNode(" " + vue.toDisplayString(_ctx.title) + " ", 1),
        vue.createVNode(_component_FormOutlined)
    ]);
}
const EditTableHeaderCell = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$s]]);
const _hoisted_1$m = { key: 1 };
const __default__$2 = {
    name: "TableHeaderCell"
};
const _sfc_main$E = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: {
        column: { default: () => {
                return {};
            } }
    },
    setup(__props) {
        const props2 = __props;
        const { prefixCls: prefixCls2 } = use.useDesign("basic-table-header-cell");
        const getIsEdit = vue.computed(() => {
            var _a2;
            return !!((_a2 = props2.column) == null ? void 0 : _a2.edit);
        });
        const getTitle = vue.computed(
            () => {
                var _a2, _b;
                return ((_a2 = props2.column) == null ? void 0 : _a2.customTitle) || ((_b = props2.column) == null ? void 0 : _b.title);
            }
        );
        const getHelpMessage = vue.computed(() => {
            var _a2;
            return (_a2 = props2.column) == null ? void 0 : _a2.helpMessage;
        });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
                vue.unref(getIsEdit) ? (vue.openBlock(), vue.createBlock(EditTableHeaderCell, { key: 0 }, {
                    default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(vue.unref(getTitle)), 1)
                    ]),
                    _: 1
                })) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$m, vue.toDisplayString(vue.unref(getTitle)), 1)),
                vue.unref(getHelpMessage) ? (vue.openBlock(), vue.createBlock(vue.unref(_sfc_main$1g), {
                    key: 2,
                    text: vue.unref(getHelpMessage),
                    class: vue.normalizeClass(`${vue.unref(prefixCls2)}__help`)
                }, null, 8, ["text", "class"])) : vue.createCommentVNode("", true)
            ], 64);
        };
    }
});
const HeaderCell_vue_vue_type_style_index_0_lang = "";
function itemRender({
                        page,
                        type,
                        originalElement
                    }) {
    if (type === "prev") {
        return page === 0 ? null : vue.createVNode(LeftOutlined$1, null, null);
    } else if (type === "next") {
        return page === 1 ? null : vue.createVNode(RightOutlined$1, null, null);
    }
    return originalElement;
}
function usePagination$1(refProps) {
    const configRef = vue.ref({});
    const show = vue.ref(true);
    vue.watch(() => vue.unref(refProps).pagination, (pagination) => {
        if (!utils.isBoolean(pagination) && pagination) {
            configRef.value = {
                ...vue.unref(configRef),
                ...pagination ?? {}
            };
        }
    });
    const getPaginationInfo = vue.computed(() => {
        const {
            pagination
        } = vue.unref(refProps);
        if (!vue.unref(show) || utils.isBoolean(pagination) && !pagination) {
            return false;
        }
        return {
            current: 1,
            pageSize: PAGE_SIZE,
            size: "small",
            defaultPageSize: PAGE_SIZE,
            showTotal: (total) => `共 ${total} 条数据`,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            itemRender,
            showQuickJumper: true,
            ...utils.isBoolean(pagination) ? {} : pagination,
            ...vue.unref(configRef)
        };
    });
    function setPagination(info) {
        const paginationInfo = vue.unref(getPaginationInfo);
        configRef.value = {
            ...!utils.isBoolean(paginationInfo) ? paginationInfo : {},
            ...info
        };
    }
    function getPagination() {
        return vue.unref(getPaginationInfo);
    }
    function getShowPagination() {
        return vue.unref(show);
    }
    async function setShowPagination(flag) {
        show.value = flag;
    }
    return {
        getPagination,
        getPaginationInfo,
        setShowPagination,
        getShowPagination,
        setPagination
    };
}
const componentMap$1 = /* @__PURE__ */ new Map();
componentMap$1.set("Input", antDesignVue.Input);
componentMap$1.set("InputNumber", antDesignVue.InputNumber);
componentMap$1.set("Select", antDesignVue.Select);
componentMap$1.set("ApiSelect", ApiSelect);
componentMap$1.set("AutoComplete", antDesignVue.AutoComplete);
componentMap$1.set("ApiTreeSelect", ApiTreeSelect);
componentMap$1.set("Switch", antDesignVue.Switch);
componentMap$1.set("Checkbox", antDesignVue.Checkbox);
componentMap$1.set("DatePicker", antDesignVue.DatePicker);
componentMap$1.set("TimePicker", antDesignVue.TimePicker);
componentMap$1.set("RadioGroup", antDesignVue.Radio.Group);
componentMap$1.set("RadioButtonGroup", RadioButtonGroup);
componentMap$1.set("ApiRadioGroup", ApiRadioGroup);
componentMap$1.set("ApiCascader", ApiCascader);
const CellComponent$1 = ({
                             component = "Input"
                             // rule = true,
                         }, { attrs }) => {
    const Comp = componentMap$1.get(component);
    return vue.h(Comp, attrs);
};
const nodeList = /* @__PURE__ */ new Map();
let startClick;
if (!utils.isServer) {
    utils.on(document, "mousedown", (e) => startClick = e);
    utils.on(document, "mouseup", (e) => {
        for (const { documentHandler } of nodeList.values()) {
            documentHandler(e, startClick);
        }
    });
}
function createDocumentHandler(el, binding) {
    let excludes = [];
    if (Array.isArray(binding.arg)) {
        excludes = binding.arg;
    } else {
        excludes.push(binding.arg);
    }
    return function(mouseup, mousedown) {
        const popperRef = binding.instance.popperRef;
        const mouseUpTarget = mouseup.target;
        const mouseDownTarget = mousedown.target;
        const isBound = !binding || !binding.instance;
        const isTargetExists = !mouseUpTarget || !mouseDownTarget;
        const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
        const isSelf = el === mouseUpTarget;
        const isTargetExcluded = excludes.length && excludes.some((item) => item == null ? void 0 : item.contains(mouseUpTarget)) || excludes.length && excludes.includes(mouseDownTarget);
        const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
        if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) {
            return;
        }
        binding.value();
    };
}
const ClickOutside = {
    beforeMount(el, binding) {
        nodeList.set(el, {
            documentHandler: createDocumentHandler(el, binding),
            bindingFn: binding.value
        });
    },
    updated(el, binding) {
        nodeList.set(el, {
            documentHandler: createDocumentHandler(el, binding),
            bindingFn: binding.value
        });
    },
    unmounted(el) {
        nodeList.delete(el);
    }
};
function createPlaceholderMessage(component) {
    if (component.includes("Input") || component.includes("AutoComplete")) {
        return "请输入";
    }
    if (component.includes("Picker")) {
        return "请选择";
    }
    if (component.includes("Select") || component.includes("Checkbox") || component.includes("Radio") || component.includes("Switch") || component.includes("DatePicker") || component.includes("TimePicker")) {
        return "请选择";
    }
    return "";
}
const _sfc_main$D = /* @__PURE__ */ vue.defineComponent({
    name: "EditableCell",
    components: {
        FormOutlined: FormOutlined$1,
        CloseOutlined: CloseOutlined$1,
        CheckOutlined: CheckOutlined$1,
        CellComponent: CellComponent$1,
        Spin: antDesignVue.Spin
    },
    directives: {
        clickOutside: ClickOutside
    },
    props: {
        value: {
            type: [String, Number, Boolean, Object],
            default: ""
        },
        record: {
            type: Object
        },
        column: {
            type: Object,
            default: () => ({})
        },
        uuId: {
            type: String,
            default: ""
        },
        index: {
            type: Number,
            default: 0
        },
        tableAction: {
            type: Object
        }
    },
    setup(props2) {
        const table2 = useTableContext();
        const isEdit = vue.ref(false);
        const elRef = vue.ref();
        const ruleVisible = vue.ref(false);
        const ruleMessage = vue.ref("");
        const optionsRef = vue.ref([]);
        const currentValueRef = vue.ref(props2.value);
        const defaultValueRef = vue.ref(props2.value);
        const spinning = vue.ref(false);
        const prefixCls2 = "shy-editable-cell";
        const getComponent = vue.computed(() => {
            var _a2;
            return ((_a2 = props2.column) == null ? void 0 : _a2.editComponent) || "Input";
        });
        const getRule = vue.computed(() => {
            var _a2;
            return (_a2 = props2.column) == null ? void 0 : _a2.editRule;
        });
        const getRuleVisible = vue.computed(() => {
            return vue.unref(ruleMessage) && vue.unref(ruleVisible);
        });
        const getIsCheckComp = vue.computed(() => {
            const component = vue.unref(getComponent);
            return ["Checkbox", "Switch"].includes(component);
        });
        const getComponentProps = vue.computed(() => {
            var _a2;
            const isCheckValue = vue.unref(getIsCheckComp);
            const valueField = isCheckValue ? "checked" : "value";
            const val = vue.unref(currentValueRef);
            const value = isCheckValue ? utils.isNumber(val) || utils.isBoolean(val) ? val : !!val : val;
            let compProps = ((_a2 = props2.column) == null ? void 0 : _a2.editComponentProps) ?? {};
            const {
                record,
                column,
                index: index2,
                tableAction
            } = props2;
            if (utils.isFunction(compProps)) {
                compProps = compProps({
                    text: val,
                    record,
                    column,
                    index: index2,
                    tableAction
                }) ?? {};
            }
            compProps.onChangeTemp = compProps.onChange;
            delete compProps.onChange;
            const component = vue.unref(getComponent);
            const apiSelectProps = {};
            if (component === "ApiSelect") {
                apiSelectProps.cache = true;
            }
            upEditDynamicDisabled(record, column, value);
            return {
                maxlength: 100,
                size: "small",
                getPopupContainer: () => vue.unref(table2 == null ? void 0 : table2.wrapRef.value) ?? document.body,
                placeholder: createPlaceholderMessage(vue.unref(getComponent)),
                ...apiSelectProps,
                ...compProps,
                [valueField]: value,
                disabled: vue.unref(getDisable)
            };
        });
        function upEditDynamicDisabled(record, column, value) {
            if (!record)
                return false;
            const {
                key: key2,
                dataIndex
            } = column;
            if (!key2 && !dataIndex)
                return;
            const dataKey = dataIndex || key2;
            set(record, dataKey, value);
        }
        const getDisable = vue.computed(() => {
            const {
                editDynamicDisabled
            } = props2.column;
            let disabled = false;
            if (utils.isBoolean(editDynamicDisabled)) {
                disabled = editDynamicDisabled;
            }
            if (utils.isFunction(editDynamicDisabled)) {
                const {
                    record
                } = props2;
                disabled = editDynamicDisabled({
                    record
                });
            }
            return disabled;
        });
        const getValues = vue.computed(() => {
            var _a2;
            const {
                editValueMap
            } = props2.column;
            const value = vue.unref(currentValueRef);
            if (editValueMap && utils.isFunction(editValueMap)) {
                return editValueMap(value);
            }
            const component = vue.unref(getComponent);
            if (!component.includes("Select") && !component.includes("Radio")) {
                return value;
            }
            const options = ((_a2 = vue.unref(getComponentProps)) == null ? void 0 : _a2.options) ?? (vue.unref(optionsRef) || []);
            const option = options.find((item) => `${item.value}` === `${value}`);
            return (option == null ? void 0 : option.label) ?? value;
        });
        const getWrapperStyle = vue.computed(() => {
            if (vue.unref(getIsCheckComp) || vue.unref(getRowEditable)) {
                return {};
            }
            return {
                width: "calc(100% - 48px)"
            };
        });
        const getWrapperClass = vue.computed(() => {
            const {
                align = "center"
            } = props2.column;
            return `edit-cell-align-${align}`;
        });
        const getErrorClass = vue.computed(() => {
            const isRule = vue.unref(getRuleVisible);
            return isRule ? `${prefixCls2}__rule` : "";
        });
        const getRowEditable = vue.computed(() => {
            const {
                editable
            } = props2.record || {};
            return !!editable;
        });
        vue.watchEffect(() => {
            currentValueRef.value = props2.value;
        });
        vue.watchEffect(() => {
            const {
                editable
            } = props2.column;
            if (utils.isBoolean(editable) || utils.isBoolean(vue.unref(getRowEditable))) {
                isEdit.value = !!editable || vue.unref(getRowEditable);
            }
        });
        function handleEdit() {
            var _a2;
            if (vue.unref(getRowEditable) || vue.unref((_a2 = props2.column) == null ? void 0 : _a2.editRow))
                return;
            ruleMessage.value = "";
            isEdit.value = true;
            vue.nextTick(() => {
                var _a3;
                const el = vue.unref(elRef);
                (_a3 = el == null ? void 0 : el.focus) == null ? void 0 : _a3.call(el);
            });
        }
        async function handleChange(e) {
            var _a2, _b;
            const component = vue.unref(getComponent);
            if (!e) {
                currentValueRef.value = e;
            } else if (component === "Checkbox") {
                currentValueRef.value = e.target.checked;
            } else if (component === "Switch") {
                currentValueRef.value = e;
            } else if ((e == null ? void 0 : e.target) && Reflect.has(e.target, "value")) {
                currentValueRef.value = e.target.value;
            } else if (utils.isString(e) || utils.isBoolean(e) || utils.isNumber(e) || utils.isArray(e)) {
                currentValueRef.value = e;
            }
            const onChange = (_a2 = vue.unref(getComponentProps)) == null ? void 0 : _a2.onChangeTemp;
            if (onChange && utils.isFunction(onChange))
                onChange(...arguments);
            (_b = table2.emit) == null ? void 0 : _b.call(table2, "edit-change", {
                column: props2.column,
                value: vue.unref(currentValueRef),
                record: vue.toRaw(props2.record)
            });
            handleSubmitRule();
        }
        async function handleSubmitRule() {
            const {
                column,
                record
            } = props2;
            const {
                editRule
            } = column;
            const currentValue = vue.unref(currentValueRef);
            if (editRule) {
                if (utils.isBoolean(editRule) && !currentValue && !utils.isNumber(currentValue)) {
                    ruleVisible.value = true;
                    const component = vue.unref(getComponent);
                    ruleMessage.value = createPlaceholderMessage(component);
                    return false;
                }
                if (utils.isFunction(editRule)) {
                    const res = await editRule(currentValue, record);
                    if (res) {
                        ruleMessage.value = res;
                        ruleVisible.value = true;
                        return false;
                    } else {
                        ruleMessage.value = "";
                        return true;
                    }
                }
            }
            ruleMessage.value = "";
            return true;
        }
        async function handleSubmit(needEmit = true, valid = true) {
            var _a2;
            if (valid) {
                const isPass = await handleSubmitRule();
                if (!isPass)
                    return false;
            }
            const {
                column,
                index: index2,
                record
            } = props2;
            if (!record)
                return false;
            const {
                key: key2,
                dataIndex
            } = column;
            const value = vue.unref(currentValueRef);
            if (!key2 && !dataIndex)
                return;
            const dataKey = dataIndex || key2;
            if (!record.editable) {
                const {
                    getBindValues
                } = table2;
                const {
                    beforeEditSubmit,
                    columns
                } = vue.unref(getBindValues);
                if (beforeEditSubmit && utils.isFunction(beforeEditSubmit)) {
                    spinning.value = true;
                    const keys2 = columns.map((_column) => _column.dataIndex).filter((field) => !!field);
                    let result = true;
                    try {
                        result = await beforeEditSubmit({
                            record: pick$1(record, keys2),
                            index: index2,
                            key: dataKey,
                            value
                        });
                    } catch (e) {
                        result = false;
                    } finally {
                        spinning.value = false;
                    }
                    if (result === false) {
                        return;
                    }
                }
            }
            set(record, dataKey, value);
            defaultValueRef.value = value;
            needEmit && ((_a2 = table2.emit) == null ? void 0 : _a2.call(table2, "edit-end", {
                record,
                index: index2,
                key: dataKey,
                value
            }));
            isEdit.value = false;
        }
        async function handleEnter() {
            var _a2;
            if ((_a2 = props2.column) == null ? void 0 : _a2.editRow) {
                return;
            }
            handleSubmit();
        }
        function handleSubmitClick() {
            handleSubmit();
        }
        function handleCancel() {
            var _a2;
            isEdit.value = false;
            currentValueRef.value = defaultValueRef.value;
            const {
                column,
                index: index2,
                record
            } = props2;
            const {
                key: key2,
                dataIndex
            } = column;
            (_a2 = table2.emit) == null ? void 0 : _a2.call(table2, "edit-cancel", {
                record,
                index: index2,
                key: dataIndex || key2,
                value: vue.unref(currentValueRef)
            });
        }
        function onClickOutside2() {
            var _a2;
            if (((_a2 = props2.column) == null ? void 0 : _a2.editable) || vue.unref(getRowEditable)) {
                return;
            }
            const component = vue.unref(getComponent);
            if (component.includes("Input")) {
                handleCancel();
            }
        }
        function handleOptionsChange(options) {
            const {
                replaceFields
            } = vue.unref(getComponentProps);
            const component = vue.unref(getComponent);
            if (component === "ApiTreeSelect") {
                const {
                    title = "title",
                    value = "value",
                    children = "children"
                } = replaceFields || {};
                let listOptions = utils.treeToList(options, {
                    children
                });
                listOptions = listOptions.map((item) => {
                    return {
                        label: item[title],
                        value: item[value]
                    };
                });
                optionsRef.value = listOptions;
            } else {
                optionsRef.value = options;
            }
        }
        function initCbs(cbs, handle) {
            var _a2;
            if (props2.record) {
                utils.isArray(props2.record[cbs]) ? (_a2 = props2.record[cbs]) == null ? void 0 : _a2.push(handle) : props2.record[cbs] = [handle];
            }
        }
        const handleRecordEdit = () => {
            if (props2.record) {
                initCbs("submitCbs", handleSubmit);
                initCbs("validCbs", handleSubmitRule);
                initCbs("cancelCbs", handleCancel);
                if (props2.column.dataIndex) {
                    if (!props2.record.editValueRefs)
                        props2.record.editValueRefs = {};
                    props2.record.editValueRefs[props2.column.dataIndex] = currentValueRef;
                }
                props2.record.onCancelEdit = () => {
                    var _a2, _b;
                    utils.isArray((_a2 = props2.record) == null ? void 0 : _a2.cancelCbs) && ((_b = props2.record) == null ? void 0 : _b.cancelCbs.forEach((fn) => fn()));
                };
                props2.record.onSubmitEdit = async () => {
                    var _a2, _b, _c, _d, _e;
                    if (utils.isArray((_a2 = props2.record) == null ? void 0 : _a2.submitCbs)) {
                        if (!((_c = (_b = props2.record) == null ? void 0 : _b.onValid) == null ? void 0 : _c.call(_b)))
                            return;
                        const submitFns = ((_d = props2.record) == null ? void 0 : _d.submitCbs) || [];
                        submitFns.forEach((fn) => fn(false, false));
                        (_e = table2.emit) == null ? void 0 : _e.call(table2, "edit-row-end");
                        return true;
                    }
                };
            }
        };
        vue.watch(() => props2.uuId, () => {
            handleRecordEdit();
        }, {
            immediate: true
        });
        return {
            isEdit,
            prefixCls: prefixCls2,
            handleEdit,
            currentValueRef,
            handleSubmit,
            handleChange,
            handleCancel,
            elRef,
            getComponent,
            getRule,
            onClickOutside: onClickOutside2,
            ruleMessage,
            getRuleVisible,
            getComponentProps,
            handleOptionsChange,
            getWrapperStyle,
            getWrapperClass,
            getRowEditable,
            getValues,
            handleEnter,
            handleSubmitClick,
            spinning,
            getErrorClass
        };
    },
    render() {
        return vue.createVNode("div", {
            "class": this.prefixCls
        }, [vue.withDirectives(vue.createVNode("div", {
            "class": {
                [`${this.prefixCls}__normal`]: true,
                "ellipsis-cell": this.column.ellipsis
            },
            "onClick": this.handleEdit
        }, [vue.createVNode("div", {
            "class": "cell-content",
            "title": this.column.ellipsis ? this.getValues ?? "" : ""
        }, [this.column.editRender ? this.column.editRender({
            text: this.value,
            record: this.record,
            column: this.column,
            index: this.index
        }) : this.getValues ?? " "]), !this.column.editRow && vue.createVNode(FormOutlined$1, {
            "class": `${this.prefixCls}__normal-icon`
        }, null)]), [[vue.vShow, !this.isEdit]]), this.isEdit && vue.createVNode(antDesignVue.Spin, {
            "spinning": this.spinning
        }, {
            default: () => [vue.withDirectives(vue.createVNode("div", {
                "class": `${this.prefixCls}__wrapper`
            }, [vue.createVNode(CellComponent$1, vue.mergeProps(this.getComponentProps, {
                "component": this.getComponent,
                "style": this.getWrapperStyle,
                "popoverVisible": this.getRuleVisible,
                "rule": this.getRule,
                "ruleMessage": this.ruleMessage,
                "class": [this.getWrapperClass, this.getErrorClass],
                "ref": "elRef",
                "onChange": this.handleChange,
                "onOptionsChange": this.handleOptionsChange,
                "onPressEnter": this.handleEnter,
                "currIndex": this.index
            }), null), !this.getRowEditable && vue.createVNode("div", {
                "class": `${this.prefixCls}__action`
            }, [vue.createVNode(CheckOutlined$1, {
                "class": [`${this.prefixCls}__icon`, "mx-2"],
                "onClick": this.handleSubmitClick
            }, null), vue.createVNode(CloseOutlined$1, {
                "class": `${this.prefixCls}__icon `,
                "onClick": this.handleCancel
            }, null)])]), [[vue.resolveDirective("click-outside"), this.onClickOutside]])]
        })]);
    }
});
const EditableCell_vue_vue_type_style_index_0_lang = "";
const uuId = vue.ref();
function isNeedRefresh() {
    uuId.value = utils.buildUUID();
}
function renderEditCell(column, tableAction) {
    return ({ text: value, record, index: index2 }) => {
        vue.toRaw(record).onValid = async () => {
            if (utils.isArray(record == null ? void 0 : record.validCbs)) {
                const validFns = ((record == null ? void 0 : record.validCbs) || []).map((fn) => fn());
                const res = await Promise.all(validFns);
                return res.every((item) => !!item);
            } else {
                return false;
            }
        };
        vue.toRaw(record).onEdit = async (edit, submit = false) => {
            var _a2, _b;
            if (!submit) {
                record.editable = edit;
            }
            if (!edit && submit) {
                if (!await record.onValid())
                    return false;
                const res = await ((_a2 = record.onSubmitEdit) == null ? void 0 : _a2.call(record));
                if (res) {
                    record.editable = false;
                    return true;
                }
                return false;
            }
            if (!edit && !submit) {
                (_b = record.onCancelEdit) == null ? void 0 : _b.call(record);
            }
            return true;
        };
        return vue.h(_sfc_main$D, {
            value,
            record,
            column,
            index: index2,
            tableAction,
            uuId: uuId.value
        });
    };
}
function handleItem(item, ellipsis) {
    const { key: key2, dataIndex, children } = item;
    item.align = item.align || DEFAULT_ALIGN;
    if (ellipsis) {
        if (!key2) {
            item.key = dataIndex;
        }
        if (!utils.isBoolean(item.ellipsis)) {
            Object.assign(item, {
                ellipsis
            });
        }
    }
    if (children && children.length) {
        handleChildren(children, !!ellipsis);
    }
}
function handleChildren(children, ellipsis) {
    if (!children)
        return;
    children.forEach((item) => {
        const { children: children2 } = item;
        handleItem(item, ellipsis);
        handleChildren(children2, ellipsis);
    });
}
function handleIndexColumn(propsRef, getPaginationRef, columns) {
    const { showIndexColumn, indexColumnProps, isTreeTable } = vue.unref(propsRef);
    let pushIndexColumns = false;
    if (vue.unref(isTreeTable)) {
        return;
    }
    columns.forEach(() => {
        const indIndex = columns.findIndex(
            (column) => column.flag === INDEX_COLUMN_FLAG
        );
        if (showIndexColumn) {
            pushIndexColumns = indIndex === -1;
        } else if (!showIndexColumn && indIndex !== -1) {
            columns.splice(indIndex, 1);
        }
    });
    if (!pushIndexColumns)
        return;
    const isFixedLeft = columns.some((item) => item.fixed === "left");
    columns.unshift({
        flag: INDEX_COLUMN_FLAG,
        width: 50,
        title: "序号",
        align: "center",
        customRender: ({ index: index2 }) => {
            const getPagination = vue.unref(getPaginationRef);
            if (utils.isBoolean(getPagination)) {
                return `${index2 + 1}`;
            }
            const { current = 1, pageSize = PAGE_SIZE } = getPagination;
            return ((current < 1 ? 1 : current) - 1) * pageSize + index2 + 1;
        },
        ...isFixedLeft ? {
            fixed: "left"
        } : {},
        ...indexColumnProps
    });
}
function handleActionColumn(propsRef, columns) {
    const { actionColumn } = vue.unref(propsRef);
    if (!actionColumn)
        return;
    const hasIndex = columns.findIndex(
        (column) => column.flag === ACTION_COLUMN_FLAG
    );
    if (hasIndex === -1) {
        columns.push({
            ...columns[hasIndex],
            fixed: "right",
            width: ACTION_COLUMN_WIDTH,
            ...actionColumn,
            flag: ACTION_COLUMN_FLAG
        });
    }
}
function useColumns$1(propsRef, getPaginationRef, tableAction) {
    const columnsRef = vue.ref(vue.unref(propsRef).columns);
    let cacheColumns = vue.unref(propsRef).columns;
    const getColumnsRef = vue.computed(() => {
        const columns = cloneDeep(vue.unref(columnsRef));
        handleIndexColumn(propsRef, getPaginationRef, columns);
        handleActionColumn(propsRef, columns);
        if (!columns) {
            return [];
        }
        const { ellipsis } = vue.unref(propsRef);
        columns.forEach((item) => {
            const { customRender, slots } = item;
            handleItem(
                item,
                Reflect.has(item, "ellipsis") ? !!item.ellipsis : !!ellipsis && !customRender && !slots
            );
        });
        return columns;
    });
    function isIfShow(column) {
        const ifShow = column.ifShow;
        let isIfShow2 = true;
        if (utils.isBoolean(ifShow)) {
            isIfShow2 = ifShow;
        }
        if (utils.isFunction(ifShow)) {
            isIfShow2 = ifShow(column);
        }
        return isIfShow2;
    }
    const hasPermission = (key2) => true;
    const getViewColumns = vue.computed(() => {
        const viewColumns = sortFixedColumn(vue.unref(getColumnsRef));
        const columns = cloneDeep(viewColumns);
        return columns.filter((column) => {
            return hasPermission(column.auth) && isIfShow(column);
        }).map((column) => {
            const { slots, customRender, format, edit, editRow, flag } = column;
            if (!slots || !(slots == null ? void 0 : slots.title)) {
                column.customTitle = column.title;
                Reflect.deleteProperty(column, "title");
            }
            const isDefaultAction = [
                INDEX_COLUMN_FLAG,
                ACTION_COLUMN_FLAG
            ].includes(flag);
            if (!customRender && format && !edit && !isDefaultAction) {
                column.customRender = ({ text, record, index: index2 }) => {
                    return formatCell(text, format, record, index2, tableAction.value);
                };
            }
            if (customRender) {
                column.customRender = ({ ...ages }) => customRender({
                    ...ages,
                    ...{ tableAction: tableAction.value }
                });
            }
            if ((edit || editRow) && !isDefaultAction) {
                column.customRender = renderEditCell(column, tableAction.value);
            }
            if (propsRef.value.useAdvancedSearch) {
                if (column.flag === "INDEX" || column.flag === "ACTION") {
                    column.sorter = false;
                } else {
                    column.sorter = (column == null ? void 0 : column.sorter) === void 0 ? true : column.sorter;
                }
            }
            return vue.reactive(column);
        });
    });
    vue.watch(
        () => vue.unref(propsRef).columns,
        (columns) => {
            columnsRef.value = columns;
            cacheColumns = (columns == null ? void 0 : columns.filter((item) => !item.flag)) ?? [];
        }
    );
    function setCacheColumnsByField(dataIndex, value) {
        if (!dataIndex || !value) {
            return;
        }
        cacheColumns.forEach((item) => {
            if (item.dataIndex === dataIndex) {
                Object.assign(item, value);
                return;
            }
        });
    }
    function setColumns(columnList) {
        const columns = cloneDeep(columnList);
        if (!utils.isArray(columns))
            return;
        if (columns.length <= 0) {
            columnsRef.value = [];
            return;
        }
        const firstColumn = columns[0];
        const cacheKeys = cacheColumns.map((item) => item.dataIndex);
        if (!utils.isString(firstColumn) && !utils.isArray(firstColumn)) {
            columnsRef.value = columns;
        } else {
            const columnKeys = columns.map(
                (m) => m.toString()
            );
            const newColumns = [];
            cacheColumns.forEach((item) => {
                var _a2;
                newColumns.push({
                    ...item,
                    defaultHidden: !columnKeys.includes(
                        ((_a2 = item.dataIndex) == null ? void 0 : _a2.toString()) || item.key
                    )
                });
            });
            if (!isEqual(cacheKeys, columns)) {
                newColumns.sort((prev, next) => {
                    var _a2, _b;
                    return columnKeys.indexOf((_a2 = prev.dataIndex) == null ? void 0 : _a2.toString()) - columnKeys.indexOf((_b = next.dataIndex) == null ? void 0 : _b.toString());
                });
            }
            columnsRef.value = newColumns;
        }
    }
    function getColumns(opt) {
        const { ignoreIndex, ignoreAction, sort } = opt || {};
        let columns = vue.toRaw(vue.unref(getColumnsRef));
        if (ignoreIndex) {
            columns = columns.filter((item) => item.flag !== INDEX_COLUMN_FLAG);
        }
        if (ignoreAction) {
            columns = columns.filter((item) => item.flag !== ACTION_COLUMN_FLAG);
        }
        if (sort) {
            columns = sortFixedColumn(columns);
        }
        return columns;
    }
    function getCacheColumns() {
        return cacheColumns;
    }
    return {
        getColumnsRef,
        getCacheColumns,
        getColumns,
        setColumns,
        getViewColumns,
        setCacheColumnsByField
    };
}
function sortFixedColumn(columns) {
    const fixedLeftColumns = [];
    const fixedRightColumns = [];
    const defColumns = [];
    for (const column of columns) {
        if (column.fixed === "left") {
            fixedLeftColumns.push(column);
            continue;
        }
        if (column.fixed === "right") {
            fixedRightColumns.push(column);
            continue;
        }
        defColumns.push(column);
    }
    return [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(
        (item) => !item.defaultHidden
    );
}
function formatCell(text, format, record, index2, tableAction) {
    if (!format) {
        return text;
    }
    if (utils.isFunction(format)) {
        return format(text, record, index2, tableAction);
    }
    try {
        const DATE_FORMAT_PREFIX = "date|";
        if (utils.isString(format) && format.startsWith(DATE_FORMAT_PREFIX) && text) {
            const dateFormat = format.replace(DATE_FORMAT_PREFIX, "");
            if (!dateFormat) {
                return text;
            }
            return utils.formatToDate(text, dateFormat);
        }
        if (utils.isMap(format)) {
            return format.get(text);
        }
    } catch (error2) {
        return text;
    }
}
function useDataSource(propsRef, {
    getPaginationInfo,
    setPagination,
    setLoading,
    getFieldsValue,
    clearSelectedRowKeys,
    tableData,
    getCurSearchParams
}, emit) {
    const searchState = vue.reactive({
        sortInfo: {},
        filterInfo: {}
    });
    const dataSourceRef = vue.ref([]);
    const rawDataSourceRef = vue.ref({});
    vue.watchEffect(() => {
        tableData.value = vue.unref(dataSourceRef);
    });
    vue.watch(
        () => vue.unref(propsRef).dataSource,
        () => {
            const { dataSource, api } = vue.unref(propsRef);
            !api && dataSource && (dataSourceRef.value = dataSource);
        },
        {
            immediate: true
        }
    );
    function handleTableChange(pagination, filters, sorter) {
        const { clearSelectOnPageChange, sortFn, filterFn } = vue.unref(propsRef);
        if (clearSelectOnPageChange) {
            clearSelectedRowKeys();
        }
        setPagination(pagination);
        const params = {};
        if (sorter && utils.isFunction(sortFn)) {
            const sortInfo = sortFn(sorter);
            searchState.sortInfo = sortInfo;
            params.sortInfo = sortInfo;
            params.searchInfo = getCurSearchParams();
        }
        if (filters && utils.isFunction(filterFn)) {
            const filterInfo = filterFn(filters);
            searchState.filterInfo = filterInfo;
            params.filterInfo = filterInfo;
        }
        fetch(params);
    }
    function setTableKey(items) {
        if (!items || !Array.isArray(items))
            return;
        items.forEach((item) => {
            if (!item[ROW_KEY]) {
                item[ROW_KEY] = utils.buildUUID();
            }
            if (item.children && item.children.length) {
                setTableKey(item.children);
            }
        });
    }
    const getAutoCreateKey = vue.computed(() => {
        return vue.unref(propsRef).autoCreateKey && !vue.unref(propsRef).rowKey;
    });
    const getRowKey = vue.computed(() => {
        const { rowKey } = vue.unref(propsRef);
        return vue.unref(getAutoCreateKey) ? ROW_KEY : rowKey;
    });
    const getDataSourceRef = vue.computed(() => {
        const dataSource = vue.unref(dataSourceRef);
        if (!dataSource || dataSource.length === 0) {
            return vue.unref(dataSourceRef);
        }
        if (vue.unref(getAutoCreateKey)) {
            const firstItem = dataSource[0];
            const lastItem = dataSource[dataSource.length - 1];
            if (firstItem && lastItem) {
                if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
                    const data = cloneDeep(vue.unref(dataSourceRef));
                    data.forEach((item) => {
                        if (!item[ROW_KEY]) {
                            item[ROW_KEY] = utils.buildUUID();
                        }
                        if (item.children && item.children.length) {
                            setTableKey(item.children);
                        }
                    });
                    dataSourceRef.value = data;
                }
            }
        }
        return vue.unref(dataSourceRef);
    });
    async function updateTableData(index2, key2, value) {
        const record = dataSourceRef.value[index2];
        if (record) {
            dataSourceRef.value[index2][key2] = value;
        }
        return dataSourceRef.value[index2];
    }
    function updateTableDataRecord(rowKey, record) {
        const row = findTableDataRecord(rowKey);
        if (row) {
            for (const field in row) {
                if (Reflect.has(record, field))
                    row[field] = record[field];
            }
            return row;
        }
    }
    function deleteTableDataRecord(rowKey) {
        var _a2, _b, _c;
        if (!dataSourceRef.value || dataSourceRef.value.length == 0)
            return;
        const rowKeyName = vue.unref(getRowKey);
        if (!rowKeyName)
            return;
        const rowKeys = !Array.isArray(rowKey) ? [rowKey] : rowKey;
        for (const key2 of rowKeys) {
            let index2 = dataSourceRef.value.findIndex((row) => {
                let targetKeyName;
                if (typeof rowKeyName === "function") {
                    targetKeyName = rowKeyName(row);
                } else {
                    targetKeyName = rowKeyName;
                }
                return row[targetKeyName] === key2;
            });
            if (index2 >= 0) {
                dataSourceRef.value.splice(index2, 1);
            }
            index2 = (_a2 = vue.unref(propsRef).dataSource) == null ? void 0 : _a2.findIndex((row) => {
                let targetKeyName;
                if (typeof rowKeyName === "function") {
                    targetKeyName = rowKeyName(row);
                } else {
                    targetKeyName = rowKeyName;
                }
                return row[targetKeyName] === key2;
            });
            if (typeof index2 !== "undefined" && index2 !== -1)
                (_b = vue.unref(propsRef).dataSource) == null ? void 0 : _b.splice(index2, 1);
        }
        setPagination({
            total: (_c = vue.unref(propsRef).dataSource) == null ? void 0 : _c.length
        });
    }
    function insertTableDataRecord(record, index2) {
        var _a2;
        index2 = index2 ?? ((_a2 = dataSourceRef.value) == null ? void 0 : _a2.length);
        vue.unref(dataSourceRef).splice(index2, 0, record);
        return vue.unref(dataSourceRef);
    }
    function findTableDataRecord(rowKey) {
        if (!dataSourceRef.value || dataSourceRef.value.length == 0)
            return;
        const rowKeyName = vue.unref(getRowKey);
        if (!rowKeyName)
            return;
        const { childrenColumnName = "children" } = vue.unref(propsRef);
        const findRow = (array) => {
            let ret;
            array.some(function iter(r) {
                if (typeof rowKeyName === "function") {
                    if (rowKeyName(r) === rowKey) {
                        ret = r;
                        return true;
                    }
                } else {
                    if (Reflect.has(r, rowKeyName) && r[rowKeyName] === rowKey) {
                        ret = r;
                        return true;
                    }
                }
                return r[childrenColumnName] && r[childrenColumnName].some(iter);
            });
            return ret;
        };
        return findRow(dataSourceRef.value);
    }
    async function fetch(opt) {
        const {
            api,
            searchInfo,
            defSort,
            fetchSetting: fetchSetting2,
            beforeFetch,
            afterFetch,
            useSearchForm,
            pagination
        } = vue.unref(propsRef);
        if (!api || !utils.isFunction(api))
            return;
        try {
            setLoading(true);
            const { pageField, sizeField, listField, totalField } = Object.assign(
                {},
                FETCH_SETTING,
                fetchSetting2
            );
            let pageParams = {};
            const { current = 1, pageSize = PAGE_SIZE } = vue.unref(
                getPaginationInfo
            );
            if (utils.isBoolean(pagination) && !pagination || utils.isBoolean(getPaginationInfo)) {
                pageParams = {};
            } else {
                pageParams[pageField] = opt && opt.page || current;
                pageParams[sizeField] = pageSize;
            }
            const { sortInfo = {}, filterInfo } = searchState;
            let params = merge$1(
                pageParams,
                useSearchForm ? getFieldsValue() : {},
                searchInfo,
                (opt == null ? void 0 : opt.searchInfo) ?? {},
                defSort,
                sortInfo,
                filterInfo,
                (opt == null ? void 0 : opt.sortInfo) ?? {},
                (opt == null ? void 0 : opt.filterInfo) ?? {}
            );
            if (beforeFetch && utils.isFunction(beforeFetch)) {
                params = await beforeFetch(params) || params;
            }
            const newval = Object.keys(params).reduce((prev, cur) => {
                if (params[cur] !== void 0 && params[cur] !== null && params[cur] !== "")
                    prev[cur] = params[cur];
                return prev;
            }, {});
            const res = await api(newval);
            rawDataSourceRef.value = res;
            const isArrayResult = Array.isArray(res);
            let resultItems = isArrayResult ? res : get(res, listField);
            const resultTotal = isArrayResult ? res.length : get(res, totalField);
            if (resultTotal) {
                const currentTotalPage = Math.ceil(resultTotal / pageSize);
                if (current > currentTotalPage) {
                    setPagination({
                        current: currentTotalPage
                    });
                    return await fetch(opt);
                }
            }
            if (afterFetch && utils.isFunction(afterFetch)) {
                resultItems = await afterFetch(resultItems) || resultItems;
            }
            dataSourceRef.value = resultItems;
            setPagination({
                total: resultTotal || 0
            });
            if (opt && opt.page) {
                setPagination({
                    current: opt.page || 1
                });
            }
            emit("fetch-success", {
                items: vue.unref(resultItems),
                total: resultTotal
            });
            return resultItems;
        } catch (error2) {
            emit("fetch-error", error2);
            dataSourceRef.value = [];
            setPagination({
                total: 0
            });
        } finally {
            setLoading(false);
        }
    }
    function setTableData(values) {
        dataSourceRef.value = values;
    }
    function getDataSource() {
        return getDataSourceRef.value;
    }
    function getRawDataSource() {
        return rawDataSourceRef.value;
    }
    async function reload(opt) {
        return await fetch(opt);
    }
    vue.onMounted(() => {
        use.useTimeoutFn(() => {
            vue.unref(propsRef).immediate && fetch();
        }, 16);
    });
    return {
        getDataSourceRef,
        getDataSource,
        getRawDataSource,
        getRowKey,
        setTableData,
        getAutoCreateKey,
        fetch,
        reload,
        updateTableData,
        updateTableDataRecord,
        deleteTableDataRecord,
        insertTableDataRecord,
        findTableDataRecord,
        handleTableChange
    };
}
function useLoading$1(props2) {
    const loadingRef = vue.ref(vue.unref(props2).loading);
    vue.watch(
        () => vue.unref(props2).loading,
        (loading) => {
            loadingRef.value = loading;
        }
    );
    const getLoading = vue.computed(() => vue.unref(loadingRef));
    function setLoading(loading) {
        loadingRef.value = loading;
    }
    return { getLoading, setLoading };
}
function useRowSelection(propsRef, tableData, emit) {
    const selectedRowKeysRef = vue.ref([]);
    const selectedRowRef = vue.ref([]);
    const getRowSelectionRef = vue.computed(() => {
        const { rowSelection } = vue.unref(propsRef);
        if (!rowSelection) {
            return null;
        }
        return {
            selectedRowKeys: vue.unref(selectedRowKeysRef),
            onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys);
            },
            ...omit$1(rowSelection, ["onChange"])
        };
    });
    vue.watch(
        () => {
            var _a2;
            return (_a2 = vue.unref(propsRef).rowSelection) == null ? void 0 : _a2.selectedRowKeys;
        },
        (v) => {
            setSelectedRowKeys(v);
        }
    );
    vue.watch(
        () => vue.unref(selectedRowKeysRef),
        () => {
            vue.nextTick(() => {
                const { rowSelection } = vue.unref(propsRef);
                if (rowSelection) {
                    const { onChange } = rowSelection;
                    if (onChange && utils.isFunction(onChange))
                        onChange(getSelectRowKeys(), getSelectRows());
                }
                emit("selection-change", {
                    keys: getSelectRowKeys(),
                    rows: getSelectRows()
                });
            });
        },
        { deep: true }
    );
    const getAutoCreateKey = vue.computed(() => {
        return vue.unref(propsRef).autoCreateKey && !vue.unref(propsRef).rowKey;
    });
    const getRowKey = vue.computed(() => {
        const { rowKey } = vue.unref(propsRef);
        return vue.unref(getAutoCreateKey) ? ROW_KEY : rowKey;
    });
    function setSelectedRowKeys(rowKeys) {
        selectedRowKeysRef.value = rowKeys;
        const allSelectedRows = utils.findNodeAll(
            vue.toRaw(vue.unref(tableData)).concat(vue.toRaw(vue.unref(selectedRowRef))),
            (item) => rowKeys == null ? void 0 : rowKeys.includes(item[vue.unref(getRowKey)]),
            {
                children: propsRef.value.childrenColumnName ?? "children"
            }
        );
        const trueSelectedRows = [];
        rowKeys == null ? void 0 : rowKeys.forEach((key2) => {
            const found = allSelectedRows.find(
                (item) => item[vue.unref(getRowKey)] === key2
            );
            found && trueSelectedRows.push(found);
        });
        selectedRowRef.value = trueSelectedRows;
    }
    function setSelectedRows(rows) {
        selectedRowRef.value = rows;
    }
    function clearSelectedRowKeys() {
        selectedRowRef.value = [];
        selectedRowKeysRef.value = [];
    }
    function deleteSelectRowByKey(key2) {
        const selectedRowKeys = vue.unref(selectedRowKeysRef);
        const index2 = selectedRowKeys.findIndex((item) => item === key2);
        if (index2 !== -1) {
            vue.unref(selectedRowKeysRef).splice(index2, 1);
        }
    }
    function getSelectRowKeys() {
        return vue.unref(selectedRowKeysRef);
    }
    function getSelectRows() {
        return vue.unref(selectedRowRef);
    }
    function getRowSelection() {
        return vue.unref(getRowSelectionRef);
    }
    return {
        getRowSelection,
        getRowSelectionRef,
        getSelectRows,
        getSelectRowKeys,
        setSelectedRowKeys,
        clearSelectedRowKeys,
        deleteSelectRowByKey,
        setSelectedRows
    };
}
function useTableScroll(propsRef, tableElRef, columnsRef, rowSelectionRef, getDataSourceRef, wrapRef, formRef) {
    const tableHeightRef = vue.ref(167);
    const modalFn = useModalContext();
    const debounceRedoHeight = useDebounceFn$1(redoHeight, 100);
    const getCanResize = vue.computed(() => {
        const { canResize, scroll } = vue.unref(propsRef);
        return canResize && !(scroll || {}).y;
    });
    vue.watch(
        () => {
            var _a2;
            return [vue.unref(getCanResize), (_a2 = vue.unref(getDataSourceRef)) == null ? void 0 : _a2.length];
        },
        () => {
            debounceRedoHeight();
        },
        {
            flush: "post"
        }
    );
    function redoHeight() {
        vue.nextTick(() => {
            calcTableHeight();
        });
    }
    function setHeight(height) {
        var _a2;
        tableHeightRef.value = height;
        (_a2 = modalFn == null ? void 0 : modalFn.redoModalHeight) == null ? void 0 : _a2.call(modalFn);
    }
    let paginationEl;
    let footerEl;
    let bodyEl;
    async function calcTableHeight() {
        var _a2, _b, _c;
        const {
            resizeHeightOffset,
            pagination,
            maxHeight,
            isCanResizeParent,
            useSearchForm
        } = vue.unref(propsRef);
        const tableData = vue.unref(getDataSourceRef);
        const table2 = vue.unref(tableElRef);
        if (!table2)
            return;
        const tableEl = table2.$el;
        if (!tableEl)
            return;
        if (!bodyEl) {
            bodyEl = tableEl.querySelector(".ant-table-body");
            if (!bodyEl)
                return;
        }
        const hasScrollBarY = bodyEl.scrollHeight > bodyEl.clientHeight;
        const hasScrollBarX = bodyEl.scrollWidth > bodyEl.clientWidth;
        if (hasScrollBarY) {
            tableEl.classList.contains("hide-scrollbar-y") && tableEl.classList.remove("hide-scrollbar-y");
        } else {
            !tableEl.classList.contains("hide-scrollbar-y") && tableEl.classList.add("hide-scrollbar-y");
        }
        if (hasScrollBarX) {
            tableEl.classList.contains("hide-scrollbar-x") && tableEl.classList.remove("hide-scrollbar-x");
        } else {
            !tableEl.classList.contains("hide-scrollbar-x") && tableEl.classList.add("hide-scrollbar-x");
        }
        bodyEl.style.height = "unset";
        if (!vue.unref(getCanResize) || !vue.unref(tableData))
            return;
        await vue.nextTick();
        const headEl = tableEl.querySelector(".ant-table-thead ");
        if (!headEl)
            return;
        let paddingHeight = propsRef.value.useTableWrapper ? 20 : 10;
        let paginationHeight = 10;
        if (!!utils.isBoolean(pagination) && tableData.length !== 0) {
            paginationEl = tableEl.querySelector(".ant-pagination");
            if (paginationEl) {
                const offsetHeight = paginationEl.offsetHeight;
                paginationHeight += offsetHeight || 0;
            } else {
                paginationHeight += 24;
            }
        } else {
            paginationHeight = 0;
        }
        let footerHeight = 0;
        if (!utils.isBoolean(pagination)) {
            if (!footerEl) {
                footerEl = tableEl.querySelector(".ant-table-footer");
            } else {
                const offsetHeight = footerEl.offsetHeight;
                footerHeight += offsetHeight || 0;
            }
        }
        let headerHeight = 0;
        if (headEl) {
            headerHeight = headEl.offsetHeight + 1;
        }
        let bottomIncludeBody = 0;
        if (vue.unref(wrapRef) && isCanResizeParent) {
            const tablePadding = 12;
            const formMargin = 16;
            let paginationMargin = 10;
            const wrapHeight = ((_a2 = vue.unref(wrapRef)) == null ? void 0 : _a2.offsetHeight) ?? 0;
            let formHeight = ((_b = vue.unref(formRef)) == null ? void 0 : _b.$el.offsetHeight) ?? 0;
            if (formHeight) {
                formHeight += formMargin;
            }
            if (utils.isBoolean(pagination) && !pagination) {
                paginationMargin = 0;
            }
            if (utils.isBoolean(useSearchForm) && !useSearchForm) {
                paddingHeight = 0;
            }
            const headerCellHeight = ((_c = tableEl.querySelector(".ant-table-title")) == null ? void 0 : _c.offsetHeight) ?? 0;
            bottomIncludeBody = wrapHeight - formHeight - headerCellHeight - tablePadding - paginationMargin;
        } else {
            bottomIncludeBody = utils.getViewportOffset(headEl).bottomIncludeBody;
        }
        let height = bottomIncludeBody - (resizeHeightOffset || 0) - paddingHeight - paginationHeight - footerHeight - headerHeight;
        height = height > maxHeight ? maxHeight : height;
        height = Math.floor(height);
        setHeight(height);
        bodyEl.style.height = `${height}px`;
    }
    use.useWindowSizeFn(calcTableHeight, 280);
    use.onMountedOrActivated(() => {
        calcTableHeight();
        vue.nextTick(() => {
            debounceRedoHeight();
        });
    });
    const getScrollX = vue.computed(() => {
        var _a2, _b;
        let width = 0;
        if (vue.unref(rowSelectionRef)) {
            width += 60;
        }
        const NORMAL_WIDTH = 150;
        const columns = vue.unref(columnsRef).filter((item) => !item.defaultHidden);
        columns.forEach((item) => {
            width += Number.parseFloat(item.width) || 0;
        });
        const unsetWidthColumns = columns.filter(
            (item) => !Reflect.has(item, "width")
        );
        const len = unsetWidthColumns.length;
        if (len !== 0) {
            width += len * NORMAL_WIDTH;
        }
        const table2 = vue.unref(tableElRef);
        const tableWidth = ((_a2 = table2 == null ? void 0 : table2.$el) == null ? void 0 : _a2.offsetWidth) ?? 0;
        /* @__PURE__ */ console.log(tableWidth, (_b = table2 == null ? void 0 : table2.$el) == null ? void 0 : _b.offsetWidth, width);
        return tableWidth > width ? "100%" : width;
    });
    const getScrollRef = vue.computed(() => {
        const tableHeight = tableHeightRef.value;
        const { canResize, scroll } = vue.unref(propsRef);
        return {
            x: vue.unref(getScrollX),
            y: canResize ? tableHeight : null,
            scrollToFirstRowOnChange: false,
            ...scroll
        };
    });
    return { getScrollRef, redoHeight };
}
function useTableScrollTo(tableElRef, getDataSourceRef) {
    let bodyEl;
    async function findTargetRowToScroll(targetRowData) {
        const { id } = targetRowData;
        const targetRowEl = bodyEl == null ? void 0 : bodyEl.querySelector(
            `[data-row-key="${id}"]`
        );
        await vue.nextTick();
        bodyEl == null ? void 0 : bodyEl.scrollTo({
            top: (targetRowEl == null ? void 0 : targetRowEl.offsetTop) ?? 0,
            behavior: "smooth"
        });
    }
    function scrollTo(pos) {
        const table2 = vue.unref(tableElRef);
        if (!table2)
            return;
        const tableEl = table2.$el;
        if (!tableEl)
            return;
        if (!bodyEl) {
            bodyEl = tableEl.querySelector(".ant-table-body");
            if (!bodyEl)
                return;
        }
        const dataSource = vue.unref(getDataSourceRef);
        if (!dataSource)
            return;
        if (pos === "top") {
            findTargetRowToScroll(dataSource[0]);
        } else if (pos === "bottom") {
            findTargetRowToScroll(dataSource[dataSource.length - 1]);
        } else {
            const targetRowData = dataSource.find((data) => data.id === pos);
            if (targetRowData) {
                findTargetRowToScroll(targetRowData);
            } else {
                utils.warn(`id: ${pos} doesn't exist`);
            }
        }
    }
    return { scrollTo };
}
function getKey(record, rowKey, autoCreateKey) {
    if (!rowKey || autoCreateKey) {
        return record[ROW_KEY];
    }
    if (utils.isString(rowKey)) {
        return record[rowKey];
    }
    if (utils.isFunction(rowKey)) {
        return record[rowKey(record)];
    }
    return null;
}
function useCustomRow(propsRef, {
    setSelectedRowKeys,
    getSelectRowKeys,
    getAutoCreateKey,
    clearSelectedRowKeys,
    emit
}) {
    const customRow = (record, index2) => {
        index2 === 0 && isNeedRefresh();
        return {
            onClick: (e) => {
                e == null ? void 0 : e.stopPropagation();
                function handleClick() {
                    var _a2;
                    const { rowSelection, rowKey, clickToRowSelect } = vue.unref(propsRef);
                    if (!rowSelection || !clickToRowSelect)
                        return;
                    const keys2 = getSelectRowKeys() || [];
                    const key2 = getKey(record, rowKey, vue.unref(getAutoCreateKey));
                    if (!key2)
                        return;
                    const isCheckbox = rowSelection.type === "checkbox";
                    if (isCheckbox) {
                        const tr = (_a2 = e.composedPath) == null ? void 0 : _a2.call(e).find((dom) => dom.tagName === "TR");
                        if (!tr)
                            return;
                        const checkBox = tr.querySelector("input[type=checkbox]");
                        if (!checkBox || checkBox.hasAttribute("disabled"))
                            return;
                        if (!keys2.includes(key2)) {
                            setSelectedRowKeys([...keys2, key2]);
                            return;
                        }
                        const keyIndex = keys2.findIndex((item) => item === key2);
                        keys2.splice(keyIndex, 1);
                        setSelectedRowKeys(keys2);
                        return;
                    }
                    const isRadio = rowSelection.type === "radio";
                    if (isRadio) {
                        if (!keys2.includes(key2)) {
                            if (keys2.length) {
                                clearSelectedRowKeys();
                            }
                            setSelectedRowKeys([key2]);
                            return;
                        }
                        clearSelectedRowKeys();
                    }
                }
                handleClick();
                emit("row-click", record, index2, e);
            },
            onDblclick: (event) => {
                emit("row-dbClick", record, index2, event);
            },
            onContextmenu: (event) => {
                emit("row-contextmenu", record, index2, event);
            },
            onMouseenter: (event) => {
                emit("row-mouseenter", record, index2, event);
            },
            onMouseleave: (event) => {
                emit("row-mouseleave", record, index2, event);
            }
        };
    };
    return {
        customRow
    };
}
function useTableStyle(propsRef, prefixCls2) {
    function getRowClassName(record, index2) {
        const { striped, rowClassName } = vue.unref(propsRef);
        const classNames = [];
        if (striped) {
            classNames.push((index2 || 0) % 2 === 1 ? `${prefixCls2}-row__striped` : "");
        }
        if (rowClassName && utils.isFunction(rowClassName)) {
            classNames.push(rowClassName(record, index2));
        }
        return classNames.filter((cls) => !!cls).join(" ");
    }
    return { getRowClassName };
}
const __default__$1 = {
    name: "ColumnSetting"
};
const _sfc_main$C = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    emits: ["columns-change"],
    setup(__props, { emit }) {
        const attrs = vue.useAttrs();
        const { t: t2 } = use.useI18n();
        t2("component.table.settingColumn");
        const table2 = useTableContext();
        const defaultRowSelection = omit$1(table2.getRowSelection(), "selectedRowKeys");
        let inited = false;
        const cachePlainOptions = vue.ref([]);
        const plainOptions = vue.ref([]);
        const plainSortOptions = vue.ref([]);
        const columnListRef = vue.ref(null);
        const state = vue.reactive({
            checkAll: true,
            checkedList: [],
            defaultCheckList: []
        });
        const checkIndex = vue.ref(false);
        const checkSelect = vue.ref(false);
        const { prefixCls: prefixCls2 } = use.useDesign("basic-column-setting");
        const getValues = vue.computed(() => {
            return vue.unref(table2 == null ? void 0 : table2.getBindValues) || {};
        });
        vue.watchEffect(() => {
            setTimeout(() => {
                const columns = table2.getColumns();
                if (columns.length && !state.isInit) {
                    init();
                }
            }, 0);
        });
        vue.watchEffect(() => {
            const values = vue.unref(getValues);
            checkIndex.value = !!values.showIndexColumn;
            checkSelect.value = !!values.rowSelection;
        });
        function getColumns() {
            const ret = [];
            table2.getColumns({ ignoreIndex: true, ignoreAction: true }).forEach((item) => {
                ret.push({
                    label: item.title || item.customTitle,
                    value: item.dataIndex || item.title,
                    ...item
                });
            });
            return ret;
        }
        function init() {
            const columns = getColumns();
            const checkList = table2.getColumns({ ignoreAction: true, ignoreIndex: true }).map((item) => {
                if (item.defaultHidden) {
                    return "";
                }
                return item.dataIndex || item.title;
            }).filter(Boolean);
            if (!plainOptions.value.length) {
                plainOptions.value = columns;
                plainSortOptions.value = columns;
                cachePlainOptions.value = columns;
                state.defaultCheckList = checkList;
            } else {
                vue.unref(plainOptions).forEach((item) => {
                    const findItem = columns.find(
                        (col) => col.dataIndex === item.dataIndex
                    );
                    if (findItem) {
                        item.fixed = findItem.fixed;
                    }
                });
            }
            state.isInit = true;
            state.checkedList = checkList;
        }
        function onCheckAllChange(e) {
            const checkList = plainOptions.value.map((item) => item.value);
            if (e.target.checked) {
                state.checkedList = checkList;
                setColumns(checkList);
            } else {
                state.checkedList = [];
                setColumns([]);
            }
        }
        const indeterminate = vue.computed(() => {
            const len = plainOptions.value.length;
            let checkedLen = state.checkedList.length;
            return checkedLen > 0 && checkedLen < len;
        });
        function onChange(checkedList) {
            const len = plainSortOptions.value.length;
            state.checkAll = checkedList.length === len;
            const sortList = vue.unref(plainSortOptions).map((item) => item.value);
            checkedList.sort((prev, next) => {
                return sortList.indexOf(prev) - sortList.indexOf(next);
            });
            setColumns(checkedList);
        }
        let sortable;
        let sortableOrder = [];
        function reset2() {
            state.checkedList = [...state.defaultCheckList];
            state.checkAll = true;
            plainOptions.value = vue.unref(cachePlainOptions);
            plainSortOptions.value = vue.unref(cachePlainOptions);
            setColumns(table2.getCacheColumns());
            sortable.sort(sortableOrder);
        }
        function handleVisibleChange() {
            if (inited)
                return;
            vue.nextTick(() => {
                const columnListEl = vue.unref(columnListRef);
                if (!columnListEl)
                    return;
                const el = columnListEl.$el;
                if (!el)
                    return;
                sortable = Sortablejs.create(vue.unref(el), {
                    animation: 500,
                    delay: 400,
                    delayOnTouchOnly: true,
                    handle: ".table-column-drag-icon ",
                    onEnd: (evt) => {
                        const { oldIndex, newIndex } = evt;
                        if (utils.isNullAndUnDef(oldIndex) || utils.isNullAndUnDef(newIndex) || oldIndex === newIndex) {
                            return;
                        }
                        const columns = cloneDeep(plainSortOptions.value);
                        if (oldIndex > newIndex) {
                            columns.splice(newIndex, 0, columns[oldIndex]);
                            columns.splice(oldIndex + 1, 1);
                        } else {
                            columns.splice(newIndex + 1, 0, columns[oldIndex]);
                            columns.splice(oldIndex, 1);
                        }
                        plainSortOptions.value = columns;
                        setColumns(
                            columns.map((col) => col.value).filter((value) => state.checkedList.includes(value))
                        );
                    }
                });
                sortableOrder = sortable.toArray();
                inited = true;
            });
        }
        function handleIndexCheckChange(e) {
            table2.setProps({
                showIndexColumn: e.target.checked
            });
        }
        function handleSelectCheckChange(e) {
            table2.setProps({
                rowSelection: e.target.checked ? defaultRowSelection : void 0
            });
        }
        function handleColumnFixed(item, fixed) {
            var _a2;
            if (!state.checkedList.includes(item.dataIndex))
                return;
            const columns = getColumns();
            const isFixed = item.fixed === fixed ? false : fixed;
            const index2 = columns.findIndex((col) => col.dataIndex === item.dataIndex);
            if (index2 !== -1) {
                columns[index2].fixed = isFixed;
            }
            item.fixed = isFixed;
            if (isFixed && !item.width) {
                item.width = 100;
            }
            (_a2 = table2.setCacheColumnsByField) == null ? void 0 : _a2.call(table2, item.dataIndex, {
                fixed: isFixed
            });
            setColumns(columns);
        }
        function setColumns(columns) {
            table2.setColumns(columns);
            const data = vue.unref(plainSortOptions).map((col) => {
                const visible = columns.findIndex(
                    (c) => c === col.value || typeof c !== "string" && c.dataIndex === col.value
                ) !== -1;
                return { dataIndex: col.value, fixed: col.fixed, visible };
            });
            emit("columns-change", data);
        }
        function getPopupContainer2() {
            return utils.isFunction(attrs.getPopupContainer) ? attrs.getPopupContainer() : utils.getPopupContainer();
        }
        return (_ctx, _cache) => {
            const _component_a_button = vue.resolveComponent("a-button");
            const _component_CheckboxGroup = vue.resolveComponent("CheckboxGroup");
            return vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Tooltip), { placement: "top" }, {
                title: vue.withCtx(() => [
                    vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(t2)("component.table.settingColumn")), 1)
                ]),
                default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(antDesignVue.Popover), {
                        placement: "bottomLeft",
                        trigger: "click",
                        onVisibleChange: handleVisibleChange,
                        overlayClassName: `${vue.unref(prefixCls2)}__cloumn-list`,
                        getPopupContainer: getPopupContainer2
                    }, {
                        title: vue.withCtx(() => [
                            vue.createElementVNode("div", {
                                class: vue.normalizeClass(`${vue.unref(prefixCls2)}__popover-title`)
                            }, [
                                vue.createVNode(vue.unref(antDesignVue.Checkbox), {
                                    indeterminate: vue.unref(indeterminate),
                                    checked: state.checkAll,
                                    "onUpdate:checked": _cache[0] || (_cache[0] = ($event) => state.checkAll = $event),
                                    onChange: onCheckAllChange
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("component.table.settingColumnShow")), 1)
                                    ]),
                                    _: 1
                                }, 8, ["indeterminate", "checked"]),
                                vue.createVNode(vue.unref(antDesignVue.Checkbox), {
                                    checked: checkIndex.value,
                                    "onUpdate:checked": _cache[1] || (_cache[1] = ($event) => checkIndex.value = $event),
                                    onChange: handleIndexCheckChange
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("component.table.settingIndexColumnShow")), 1)
                                    ]),
                                    _: 1
                                }, 8, ["checked"]),
                                vue.createVNode(vue.unref(antDesignVue.Checkbox), {
                                    checked: checkSelect.value,
                                    "onUpdate:checked": _cache[2] || (_cache[2] = ($event) => checkSelect.value = $event),
                                    onChange: handleSelectCheckChange,
                                    disabled: !vue.unref(defaultRowSelection)
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("component.table.settingSelectColumnShow")), 1)
                                    ]),
                                    _: 1
                                }, 8, ["checked", "disabled"]),
                                vue.createVNode(_component_a_button, {
                                    size: "small",
                                    type: "link",
                                    onClick: reset2
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("common.resetText")), 1)
                                    ]),
                                    _: 1
                                })
                            ], 2)
                        ]),
                        content: vue.withCtx(() => [
                            vue.createVNode(vue.unref(ScrollContainer$1), null, {
                                default: vue.withCtx(() => [
                                    vue.createVNode(_component_CheckboxGroup, {
                                        value: state.checkedList,
                                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => state.checkedList = $event),
                                        onChange,
                                        ref_key: "columnListRef",
                                        ref: columnListRef
                                    }, {
                                        default: vue.withCtx(() => [
                                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(plainOptions.value, (item) => {
                                                return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                                                    key: item.value
                                                }, [
                                                    !("ifShow" in item && !item.ifShow) ? (vue.openBlock(), vue.createElementBlock("div", {
                                                        key: 0,
                                                        class: vue.normalizeClass(`${vue.unref(prefixCls2)}__check-item`)
                                                    }, [
                                                        vue.createVNode(vue.unref(DragOutlined$1), { class: "table-column-drag-icon" }),
                                                        vue.createVNode(vue.unref(antDesignVue.Checkbox), {
                                                            value: item.value
                                                        }, {
                                                            default: vue.withCtx(() => [
                                                                vue.createTextVNode(vue.toDisplayString(item.label), 1)
                                                            ]),
                                                            _: 2
                                                        }, 1032, ["value"]),
                                                        vue.createVNode(vue.unref(antDesignVue.Tooltip), {
                                                            placement: "bottomLeft",
                                                            mouseLeaveDelay: 0.4,
                                                            getPopupContainer: getPopupContainer2
                                                        }, {
                                                            title: vue.withCtx(() => [
                                                                vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("component.table.settingFixedLeft")), 1)
                                                            ]),
                                                            default: vue.withCtx(() => [
                                                                vue.createVNode(vue.unref(Icon2), {
                                                                    icon: "line-md:arrow-align-left",
                                                                    class: vue.normalizeClass([
                                                                        `${vue.unref(prefixCls2)}__fixed-left`,
                                                                        {
                                                                            active: item.fixed === "left",
                                                                            disabled: !state.checkedList.includes(item.value)
                                                                        }
                                                                    ]),
                                                                    onClick: ($event) => handleColumnFixed(item, "left")
                                                                }, null, 8, ["class", "onClick"])
                                                            ]),
                                                            _: 2
                                                        }, 1032, ["mouseLeaveDelay"]),
                                                        vue.createVNode(vue.unref(antDesignVue.Divider), { type: "vertical" }),
                                                        vue.createVNode(vue.unref(antDesignVue.Tooltip), {
                                                            placement: "bottomLeft",
                                                            mouseLeaveDelay: 0.4,
                                                            getPopupContainer: getPopupContainer2
                                                        }, {
                                                            title: vue.withCtx(() => [
                                                                vue.createTextVNode(vue.toDisplayString(vue.unref(t2)("component.table.settingFixedRight")), 1)
                                                            ]),
                                                            default: vue.withCtx(() => [
                                                                vue.createVNode(vue.unref(Icon2), {
                                                                    icon: "line-md:arrow-align-left",
                                                                    class: vue.normalizeClass([
                                                                        `${vue.unref(prefixCls2)}__fixed-right`,
                                                                        {
                                                                            active: item.fixed === "right",
                                                                            disabled: !state.checkedList.includes(item.value)
                                                                        }
                                                                    ]),
                                                                    onClick: ($event) => handleColumnFixed(item, "right")
                                                                }, null, 8, ["class", "onClick"])
                                                            ]),
                                                            _: 2
                                                        }, 1032, ["mouseLeaveDelay"])
                                                    ], 2)) : vue.createCommentVNode("", true)
                                                ], 64);
                                            }), 128))
                                        ]),
                                        _: 1
                                    }, 8, ["value"])
                                ]),
                                _: 1
                            })
                        ]),
                        default: vue.withCtx(() => [
                            vue.createVNode(vue.unref(SettingOutlined$1))
                        ]),
                        _: 1
                    }, 8, ["overlayClassName"])
                ]),
                _: 1
            });
        };
    }
});
const ColumnSetting_vue_vue_type_style_index_0_lang$1 = "";
const _sfc_main$B = vue.defineComponent({
    name: "SizeSetting",
    components: {
        ColumnHeightOutlined: ColumnHeightOutlined$1,
        Tooltip: antDesignVue.Tooltip,
        Dropdown: antDesignVue.Dropdown,
        Menu: antDesignVue.Menu,
        MenuItem: antDesignVue.Menu.Item
    },
    setup() {
        const table2 = useTableContext();
        const { t: t2 } = use.useI18n();
        const selectedKeysRef = vue.ref([table2.getSize()]);
        function handleTitleClick({ key: key2 }) {
            selectedKeysRef.value = [key2];
            table2.setProps({
                size: key2
            });
        }
        return {
            handleTitleClick,
            selectedKeysRef,
            getPopupContainer: utils.getPopupContainer,
            t: t2
        };
    }
});
function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ColumnHeightOutlined = vue.resolveComponent("ColumnHeightOutlined");
    const _component_MenuItem = vue.resolveComponent("MenuItem");
    const _component_Menu = vue.resolveComponent("Menu");
    const _component_Dropdown = vue.resolveComponent("Dropdown");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    return vue.openBlock(), vue.createBlock(_component_Tooltip, { placement: "top" }, {
        title: vue.withCtx(() => [
            vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingDens")), 1)
        ]),
        default: vue.withCtx(() => [
            vue.createVNode(_component_Dropdown, {
                placement: "bottom",
                trigger: ["click"],
                getPopupContainer: _ctx.getPopupContainer
            }, {
                overlay: vue.withCtx(() => [
                    vue.createVNode(_component_Menu, {
                        onClick: _ctx.handleTitleClick,
                        selectable: "",
                        selectedKeys: _ctx.selectedKeysRef,
                        "onUpdate:selectedKeys": _cache[0] || (_cache[0] = ($event) => _ctx.selectedKeysRef = $event)
                    }, {
                        default: vue.withCtx(() => [
                            vue.createVNode(_component_MenuItem, { key: "default" }, {
                                default: vue.withCtx(() => [
                                    vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingDensDefault")), 1)
                                ]),
                                _: 1
                            }),
                            vue.createVNode(_component_MenuItem, { key: "middle" }, {
                                default: vue.withCtx(() => [
                                    vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingDensMiddle")), 1)
                                ]),
                                _: 1
                            }),
                            vue.createVNode(_component_MenuItem, { key: "small" }, {
                                default: vue.withCtx(() => [
                                    vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingDensSmall")), 1)
                                ]),
                                _: 1
                            })
                        ]),
                        _: 1
                    }, 8, ["onClick", "selectedKeys"])
                ]),
                default: vue.withCtx(() => [
                    vue.createVNode(_component_ColumnHeightOutlined)
                ]),
                _: 1
            }, 8, ["getPopupContainer"])
        ]),
        _: 1
    });
}
const SizeSetting$1 = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$r]]);
const _sfc_main$A = vue.defineComponent({
    name: "FullScreenSetting",
    components: {
        FullscreenExitOutlined: FullscreenExitOutlined$1,
        FullscreenOutlined: FullscreenOutlined$1,
        Tooltip: antDesignVue.Tooltip
    },
    setup() {
        const table2 = useTableContext();
        const { t: t2 } = use.useI18n();
        const { toggle, isFullscreen } = useFullscreen(table2.wrapRef);
        return {
            toggle,
            isFullscreen,
            t: t2
        };
    }
});
function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FullscreenOutlined = vue.resolveComponent("FullscreenOutlined");
    const _component_FullscreenExitOutlined = vue.resolveComponent("FullscreenExitOutlined");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    return vue.openBlock(), vue.createBlock(_component_Tooltip, { placement: "top" }, {
        title: vue.withCtx(() => [
            vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingFullScreen")), 1)
        ]),
        default: vue.withCtx(() => [
            !_ctx.isFullscreen ? (vue.openBlock(), vue.createBlock(_component_FullscreenOutlined, {
                key: 0,
                onClick: _ctx.toggle
            }, null, 8, ["onClick"])) : (vue.openBlock(), vue.createBlock(_component_FullscreenExitOutlined, {
                key: 1,
                onClick: _ctx.toggle
            }, null, 8, ["onClick"]))
        ]),
        _: 1
    });
}
const FullScreenSetting$1 = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$q]]);
const _sfc_main$z = vue.defineComponent({
    name: "RedoSetting",
    components: {
        BarsOutlined: BarsOutlined$1,
        Tooltip: antDesignVue.Tooltip
    },
    setup() {
        const table2 = useTableContext();
        const { t: t2 } = use.useI18n();
        function redo() {
            const useSearchForm = vue.unref(table2.getBindValues).useSearchForm;
            table2.setProps({ useSearchForm: !useSearchForm });
        }
        return { redo, t: t2 };
    }
});
const _hoisted_1$l = /* @__PURE__ */ vue.createElementVNode("span", null, "显隐搜索", -1);
function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_bars_outlined = vue.resolveComponent("bars-outlined");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    return vue.openBlock(), vue.createBlock(_component_Tooltip, { placement: "top" }, {
        title: vue.withCtx(() => [
            _hoisted_1$l
        ]),
        default: vue.withCtx(() => [
            vue.createVNode(_component_bars_outlined, { onClick: _ctx.redo }, null, 8, ["onClick"])
        ]),
        _: 1
    });
}
const ShowSearchSetting$1 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$p]]);
const _sfc_main$y = vue.defineComponent({
    name: "AdvancedSearchSetting",
    components: {
        Tooltip: antDesignVue.Tooltip,
        FilterOutlined: FilterOutlined$1
    },
    setup() {
        const { isVisibleAdvancedSearch, closeGlobalSearch } = useTableContext();
        const handleIconClick = () => {
            vue.nextTick(() => {
                isVisibleAdvancedSearch.value = !isVisibleAdvancedSearch.value;
                closeGlobalSearch();
            });
        };
        return { isVisibleAdvancedSearch, handleIconClick };
    }
});
const AdvancedSearchSetting_vue_vue_type_style_index_0_scoped_f74ee46a_lang = "";
const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-f74ee46a"), n = n(), vue.popScopeId(), n);
const _hoisted_1$k = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("span", null, "高级搜索", -1));
function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FilterOutlined = vue.resolveComponent("FilterOutlined");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    return vue.openBlock(), vue.createBlock(_component_Tooltip, { placement: "top" }, {
        title: vue.withCtx(() => [
            _hoisted_1$k
        ]),
        default: vue.withCtx(() => [
            vue.createVNode(_component_FilterOutlined, {
                class: vue.normalizeClass({ "icon-selected": _ctx.isVisibleAdvancedSearch }),
                onClick: _ctx.handleIconClick
            }, null, 8, ["class", "onClick"])
        ]),
        _: 1
    });
}
const AdvancedSearchSetting = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$o], ["__scopeId", "data-v-f74ee46a"]]);
const index$3 = "";
const searchType = [
    {
        label: "等于",
        value: "eq"
    },
    {
        label: "不等于",
        value: "ne"
    },
    {
        label: "大于",
        value: "gt"
    },
    {
        label: "大于等于",
        value: "ge"
    },
    {
        label: "小于",
        value: "lt"
    },
    {
        label: "小于等于",
        value: "le"
    },
    {
        label: "在...之间",
        value: "bt"
    },
    {
        label: "不在...之间",
        value: "nb"
    },
    {
        label: "包含",
        value: "ct"
    },
    {
        label: "以...开头",
        value: "sw"
    },
    {
        label: "以...结尾",
        value: "ew"
    },
    {
        label: "模糊或匹配",
        value: "ol"
    },
    {
        label: "反模糊匹配",
        value: "nk"
    },
    {
        label: "多值查询",
        value: "ni"
    },
    {
        label: "为空",
        value: "nl"
    },
    {
        label: "不为空",
        value: "nn"
    }
];
const searchTypeNumber = searchType.filter((item) => {
    return ["eq", "gt", "ge", "lt", "le", "bt", "nl", "nn"].includes(item.value);
});
const searchTypeString = searchType.filter((item) => {
    return ["eq", "ct", "sw", "ew", "nl", "nn"].includes(item.value);
});
const searchTypeDate = searchType.filter((item) => {
    return ["eq", "gt", "ge", "lt", "le", "bt", "nl", "nn"].includes(item.value);
});
const searchTypeSelect = [{ label: "等于", value: "eq" }];
const stringSearchTypeSelect = [{ label: "包含", value: "ct" }];
const getGlobalAdvancedType = (fieldList, value) => {
    const temp = {};
    fieldList.forEach((field) => {
        temp[`${field}.${field}-op`] = "ct";
        temp[`${field}.${field}`] = value;
    });
    temp.gexpr = fieldList.join("|");
    return temp;
};
const _hoisted_1$j = { class: "shy-ui-advanced-search-add" };
const _hoisted_2$6 = { class: "shy-ui-advanced-search-item-wrapper" };
const _hoisted_3$4 = {
    key: 0,
    class: "shy-ui-advanced-search-item-value-range"
};
const _hoisted_4$3 = /* @__PURE__ */ vue.createElementVNode("div", { style: { "flex": "0", "width": "40px", "margin-right": "8px" } }, " 至 ", -1);
const _hoisted_5$2 = {
    key: 0,
    class: "shy-ui-advanced-search-item-value-range"
};
const _hoisted_6 = /* @__PURE__ */ vue.createElementVNode("div", { style: { "flex": "0", "width": "40px", "margin-right": "8px" } }, " 至 ", -1);
const _hoisted_7 = {
    key: 1,
    style: { "margin-left": "8px", "cursor": "pointer", "position": "relative" },
    class: "shy-ui-advanced-minus-icon"
};
const _hoisted_8 = ["onClick"];
const _sfc_main$x = /* @__PURE__ */ vue.defineComponent({
    __name: "AdvancedSearch",
    props: {
        schemas: { default: () => [
                {
                    label: "姓名",
                    field: "name",
                    advancedShow: false
                },
                {
                    label: "年龄",
                    field: "age",
                    type: "number"
                },
                { label: "生日", field: "birth", type: "date" }
            ] }
    },
    setup(__props, { expose }) {
        const props2 = __props;
        const advancedSearchRef = vue.ref();
        const formRef = vue.ref();
        const schemasCurrent = vue.reactive([]);
        const isStringSearch = (item) => {
            if (!item)
                return false;
            return item.type === "string" && /select/i.test(item.component);
        };
        const dicColumn = vue.computed(() => {
            const temp = [];
            props2.schemas.forEach((schema) => {
                if (!schema.advancedShow)
                    return;
                const flag = schemasCurrent.find((item) => {
                    return item.field === schema.field;
                });
                temp.push({
                    label: schema.label,
                    value: schema.field,
                    disabled: !!flag,
                    type: schema.type,
                    component: schema.component
                });
            });
            return temp;
        });
        if (props2.schemas.length !== 0) {
            const firstSchema = dicColumn.value[0];
            const op = isStringSearch(firstSchema) ? "ct" : "eq";
            schemasCurrent.push({ field: firstSchema == null ? void 0 : firstSchema.value, op });
        }
        const handleAdd = () => {
            const item = dicColumn.value.find((item2) => {
                return item2.disabled === false;
            });
            const column = props2.schemas.find((schema) => {
                return schema.field === item.value;
            });
            const op = isStringSearch(column) ? "ct" : "eq";
            schemasCurrent.push({ field: (item == null ? void 0 : item.value) || "", op });
        };
        const handleMinus = (index2) => {
            schemasCurrent.splice(index2, 1);
        };
        const handleFieldChange = (schema) => {
            Object.keys(schema).forEach((key2) => {
                if (key2 === "field")
                    return;
                delete schema[key2];
            });
            const column = props2.schemas.find((item) => {
                return item.field === schema.field;
            });
            schema.op = isStringSearch(column) ? "ct" : "eq";
        };
        const handleSetValNull = (schema) => {
            if (["nl", "nn"].includes(schema.op)) {
                schema[schema.field] = "";
            }
        };
        const getSearchType = (field) => {
            const type = getTypeByField(field);
            switch (type) {
                case "number":
                    return searchTypeNumber;
                case "string":
                    return searchTypeString;
                case "date":
                    return searchTypeDate;
                case "select":
                    return searchTypeSelect;
                case "stringSelect":
                    return stringSearchTypeSelect;
            }
        };
        const getComponent = (field) => {
            const column = props2.schemas.find((schema) => {
                return schema.field === field;
            });
            return (column == null ? void 0 : column.component) || "Input";
        };
        const getTypeByField = (field) => {
            const column = props2.schemas.find((schema) => {
                return schema.field === field;
            });
            const stringSelect = isStringSearch(column);
            const type = (column == null ? void 0 : column.type) || "string";
            return stringSelect ? "stringSelect" : type;
        };
        const getComponentPropsByField = (field) => {
            const column = props2.schemas.find((schema) => {
                return schema.field === field;
            });
            return (column == null ? void 0 : column.componentProps) || {};
        };
        const getSearchFrom = () => {
            let form = {};
            schemasCurrent.forEach((item) => {
                let temp = {};
                if (item.op === "bt") {
                    temp = {
                        [`${item.field}-1`]: item[`${item.field}-1`],
                        [`${item.field}-2`]: item[`${item.field}-2`],
                        [`${item.field}-op`]: item.op
                    };
                } else {
                    temp = {
                        [item.field]: item[item.field],
                        [`${item.field}-op`]: item.op
                    };
                }
                form = { ...form, ...temp };
            });
            return form;
        };
        const resetFields = () => {
            var _a2;
            schemasCurrent.splice(0, schemasCurrent.length);
            schemasCurrent.push({ field: (_a2 = dicColumn.value[0]) == null ? void 0 : _a2.value });
            formRef.value.resetFields();
        };
        expose({
            getSearchFrom,
            resetFields,
            advancedSearchRef
        });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
                class: "shy-ui-advanced-search",
                ref_key: "advancedSearchRef",
                ref: advancedSearchRef
            }, [
                vue.createElementVNode("div", _hoisted_1$j, [
                    vue.createVNode(vue.unref(PlusCircleOutlined$1)),
                    vue.createElementVNode("div", {
                        style: { "margin-left": "8px" },
                        onClick: handleAdd
                    }, "新增条件")
                ]),
                vue.createVNode(vue.unref(antDesignVue.Form), {
                    model: schemasCurrent,
                    ref_key: "formRef",
                    ref: formRef
                }, {
                    default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(antDesignVue.Row), null, {
                            default: vue.withCtx(() => [
                                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(schemasCurrent, (schema, index2) => {
                                    return vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Col), vue.normalizeProps(vue.mergeProps({ key: index2 }, (schema == null ? void 0 : schema.colProps) || { span: 24 })), {
                                        default: vue.withCtx(() => [
                                            vue.createElementVNode("div", _hoisted_2$6, [
                                                vue.createVNode(vue.unref(antDesignVue.FormItem), {
                                                    class: "shy-ui-advanced-search-item-op",
                                                    name: `${schema.field}-op`
                                                }, {
                                                    default: vue.withCtx(() => [
                                                        vue.createVNode(vue.unref(antDesignVue.Select), {
                                                            value: schema.field,
                                                            "onUpdate:value": ($event) => schema.field = $event,
                                                            style: { "width": "120px" },
                                                            options: vue.unref(dicColumn),
                                                            onChange: ($event) => handleFieldChange(schema)
                                                        }, null, 8, ["value", "onUpdate:value", "options", "onChange"])
                                                    ]),
                                                    _: 2
                                                }, 1032, ["name"]),
                                                vue.createVNode(vue.unref(antDesignVue.FormItem), {
                                                    class: "shy-ui-advanced-search-item-op",
                                                    name: `${schema.field}-op`
                                                }, {
                                                    default: vue.withCtx(() => {
                                                        var _a2;
                                                        return [
                                                            vue.createVNode(vue.unref(antDesignVue.Select), {
                                                                value: schema.op,
                                                                "onUpdate:value": ($event) => schema.op = $event,
                                                                style: { "width": "120px" },
                                                                options: getSearchType(schema == null ? void 0 : schema.field),
                                                                defaultValue: ((_a2 = getSearchType(schema == null ? void 0 : schema.field)[0]) == null ? void 0 : _a2.value) || "",
                                                                onChange: ($event) => handleSetValNull(schema)
                                                            }, null, 8, ["value", "onUpdate:value", "options", "defaultValue", "onChange"])
                                                        ];
                                                    }),
                                                    _: 2
                                                }, 1032, ["name"]),
                                                !["nl", "nn"].includes(schema.op) ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.FormItem), {
                                                    key: 0,
                                                    class: "shy-ui-advanced-search-item-value"
                                                }, {
                                                    default: vue.withCtx(() => [
                                                        getTypeByField(schema == null ? void 0 : schema.field) === "number" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                                                            schema.op === "bt" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$4, [
                                                                vue.createVNode(vue.unref(antDesignVue.FormItem), null, {
                                                                    default: vue.withCtx(() => [
                                                                        vue.createVNode(vue.unref(antDesignVue.InputNumber), {
                                                                            value: schema[`${schema.field}-1`],
                                                                            "onUpdate:value": ($event) => schema[`${schema.field}-1`] = $event,
                                                                            valueModifiers: { number: true }
                                                                        }, null, 8, ["value", "onUpdate:value"])
                                                                    ]),
                                                                    _: 2
                                                                }, 1024),
                                                                _hoisted_4$3,
                                                                vue.createVNode(vue.unref(antDesignVue.FormItem), null, {
                                                                    default: vue.withCtx(() => [
                                                                        vue.createVNode(vue.unref(antDesignVue.InputNumber), {
                                                                            value: schema[`${schema.field}-2`],
                                                                            "onUpdate:value": ($event) => schema[`${schema.field}-2`] = $event,
                                                                            valueModifiers: { number: true }
                                                                        }, null, 8, ["value", "onUpdate:value"])
                                                                    ]),
                                                                    _: 2
                                                                }, 1024)
                                                            ])) : (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.InputNumber), {
                                                                key: 1,
                                                                style: { "width": "200px" },
                                                                value: schema[schema.field],
                                                                "onUpdate:value": ($event) => schema[schema.field] = $event,
                                                                valueModifiers: { number: true }
                                                            }, null, 8, ["value", "onUpdate:value"]))
                                                        ], 64)) : getTypeByField(schema == null ? void 0 : schema.field) === "date" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                                                            schema.op === "bt" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$2, [
                                                                vue.createVNode(vue.unref(antDesignVue.FormItem), null, {
                                                                    default: vue.withCtx(() => [
                                                                        vue.createVNode(vue.unref(antDesignVue.DatePicker), {
                                                                            value: schema[`${schema.field}-1`],
                                                                            "onUpdate:value": ($event) => schema[`${schema.field}-1`] = $event,
                                                                            "value-format": "YYYY-MM-DD 00:00:00",
                                                                            format: "YYYY-MM-DD"
                                                                        }, null, 8, ["value", "onUpdate:value"])
                                                                    ]),
                                                                    _: 2
                                                                }, 1024),
                                                                _hoisted_6,
                                                                vue.createVNode(vue.unref(antDesignVue.FormItem), null, {
                                                                    default: vue.withCtx(() => [
                                                                        vue.createVNode(vue.unref(antDesignVue.DatePicker), {
                                                                            value: schema[`${schema.field}-2`],
                                                                            "onUpdate:value": ($event) => schema[`${schema.field}-2`] = $event,
                                                                            "value-format": "YYYY-MM-DD 23:59:59",
                                                                            format: "YYYY-MM-DD"
                                                                        }, null, 8, ["value", "onUpdate:value"])
                                                                    ]),
                                                                    _: 2
                                                                }, 1024)
                                                            ])) : (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.DatePicker), {
                                                                key: 1,
                                                                value: schema[schema.field],
                                                                "onUpdate:value": ($event) => schema[schema.field] = $event,
                                                                "value-format": "YYYY-MM-DD HH:mm:ss"
                                                            }, null, 8, ["value", "onUpdate:value"]))
                                                        ], 64)) : getTypeByField(schema == null ? void 0 : schema.field) === "select" ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.FormItem), { key: 2 }, {
                                                            default: vue.withCtx(() => [
                                                                getComponent(schema.field) === "ApiSelect" ? (vue.openBlock(), vue.createBlock(ApiSelect, vue.mergeProps({
                                                                    key: 0,
                                                                    value: schema[`${schema.field}`],
                                                                    "onUpdate:value": ($event) => schema[`${schema.field}`] = $event
                                                                }, getComponentPropsByField(schema.field)), null, 16, ["value", "onUpdate:value"])) : (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Select), vue.mergeProps({
                                                                    key: 1,
                                                                    value: schema[`${schema.field}`],
                                                                    "onUpdate:value": ($event) => schema[`${schema.field}`] = $event
                                                                }, getComponentPropsByField(schema.field)), null, 16, ["value", "onUpdate:value"]))
                                                            ]),
                                                            _: 2
                                                        }, 1024)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
                                                            getComponent(schema.field) === "Input" ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Input), vue.mergeProps({
                                                                key: 0,
                                                                value: schema[schema.field],
                                                                "onUpdate:value": ($event) => schema[schema.field] = $event
                                                            }, getComponentPropsByField(schema.field)), null, 16, ["value", "onUpdate:value"])) : getComponent(schema.field) === "ApiSelect" ? (vue.openBlock(), vue.createBlock(ApiSelect, vue.mergeProps({
                                                                key: 1,
                                                                value: schema[`${schema.field}`],
                                                                "onUpdate:value": ($event) => schema[`${schema.field}`] = $event
                                                            }, getComponentPropsByField(schema.field)), null, 16, ["value", "onUpdate:value"])) : (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Select), vue.mergeProps({
                                                                key: 2,
                                                                value: schema[schema.field],
                                                                "onUpdate:value": ($event) => schema[schema.field] = $event
                                                            }, getComponentPropsByField(schema.field)), null, 16, ["value", "onUpdate:value"]))
                                                        ], 64))
                                                    ]),
                                                    _: 2
                                                }, 1024)) : vue.createCommentVNode("", true),
                                                (schemasCurrent == null ? void 0 : schemasCurrent.length) !== 1 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
                                                    vue.createElementVNode("div", {
                                                        style: { "position": "absolute", "width": "14px", "height": "14px", "left": "0", "right": "0", "top": "0", "bottom": "0" },
                                                        class: "shy-basic-minus-icon",
                                                        onClick: ($event) => handleMinus(index2)
                                                    }, null, 8, _hoisted_8),
                                                    vue.createVNode(vue.unref(MinusCircleTwoTone$1), { class: "shy-ui-advanced-minus-icon" })
                                                ])) : vue.createCommentVNode("", true)
                                            ])
                                        ]),
                                        _: 2
                                    }, 1040);
                                }), 128))
                            ]),
                            _: 1
                        })
                    ]),
                    _: 1
                }, 8, ["model"])
            ], 512);
        };
    }
});
const _sfc_main$w = /* @__PURE__ */ vue.defineComponent({
    __name: "GlobalSearch",
    setup(__props) {
        const table2 = useTableContext();
        const handleClick = () => {
            table2.isVisibleGlobalSearch.value = !table2.isVisibleGlobalSearch.value;
            table2.closeAdvancedSearch();
        };
        const handleFocus = () => {
            table2.closeAdvancedSearch();
        };
        const timer = vue.ref();
        const globalSearchValue = vue.ref("");
        const handleInput = () => {
            clearTimeout(timer.value);
            timer.value = setTimeout(() => {
                table2.setGlobalSearchValue(globalSearchValue.value);
                const type = table2.getGlobalSearchType();
                const schemas = table2.getGlobalSchemas().map((item) => {
                    return item.field;
                });
                if (!globalSearchValue.value)
                    return table2.reload({ searchInfo: {} });
                if (type === 1) {
                    const params = getGlobalAdvancedType(schemas, globalSearchValue.value);
                    table2.reload({ searchInfo: { ...params } });
                    table2.setCurSearchParams(params);
                } else {
                    const fieldList = table2.getGlobalSchemas();
                    if (fieldList.length === 0)
                        return;
                    const params = getGlobalAdvancedType(fieldList, globalSearchValue.value);
                    table2.reload({ searchInfo: { ...params } });
                    table2.setCurSearchParams(params);
                }
            }, 500);
        };
        vue.onMounted(() => {
            table2.getColumns({ ignoreAction: true, ignoreIndex: true });
        });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("span", null, [
                vue.createVNode(vue.unref(antDesignVue.Input), {
                    style: { "width": "200px" },
                    placeholder: "请输入数据",
                    onFocus: handleFocus,
                    onInput: handleInput,
                    value: globalSearchValue.value,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => globalSearchValue.value = $event)
                }, {
                    prefix: vue.withCtx(() => [
                        vue.createVNode(vue.unref(SearchOutlined$1), { style: { "color": "#c8c8c8" } })
                    ]),
                    suffix: vue.withCtx(() => [
                        vue.createVNode(vue.unref(AlignCenterOutlined$1), {
                            style: vue.normalizeStyle({
                                color: vue.unref(table2).isVisibleGlobalSearch.value ? "#498bf8" : "#c8c8c8"
                            }),
                            onClick: handleClick
                        }, null, 8, ["style"])
                    ]),
                    _: 1
                }, 8, ["value"])
            ]);
        };
    }
});
const _sfc_main$v = vue.defineComponent({
    name: "TableSetting",
    components: {
        GlobalSearch: _sfc_main$w,
        ColumnSetting: _sfc_main$C,
        SizeSetting: SizeSetting$1,
        // RedoSetting,
        FullScreenSetting: FullScreenSetting$1,
        ShowSearchSetting: ShowSearchSetting$1,
        AdvancedSearchSetting
    },
    props: {
        setting: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ["columns-change"],
    setup(props2, { emit }) {
        const table2 = useTableContext();
        const getSetting = vue.computed(() => {
            return {
                redo: true,
                size: true,
                setting: true,
                fullScreen: false,
                ...props2.setting
            };
        });
        function handleColumnChange(data) {
            emit("columns-change", data);
        }
        function getTableContainer() {
            return table2 ? vue.unref(table2.wrapRef) : document.body;
        }
        const { getBindValues } = useTableContext();
        const ifShowGlobalSearch = vue.computed(() => {
            return getBindValues.value.useAdvancedSearch && getBindValues.value.columns.some((item) => {
                return item.dataIndex !== "action" && [true, void 0].includes(item.globalShow);
            });
        });
        return {
            getSetting,
            handleColumnChange,
            getTableContainer,
            getBindValues,
            ifShowGlobalSearch
        };
    }
});
const index_vue_vue_type_style_index_0_lang$1 = "";
const _hoisted_1$i = { class: "table-settings" };
function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    var _a2, _b, _c, _d, _e;
    const _component_GlobalSearch = vue.resolveComponent("GlobalSearch");
    const _component_AdvancedSearchSetting = vue.resolveComponent("AdvancedSearchSetting");
    const _component_ShowSearchSetting = vue.resolveComponent("ShowSearchSetting");
    const _component_SizeSetting = vue.resolveComponent("SizeSetting");
    const _component_ColumnSetting = vue.resolveComponent("ColumnSetting");
    const _component_FullScreenSetting = vue.resolveComponent("FullScreenSetting");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$i, [
        _ctx.ifShowGlobalSearch ? (vue.openBlock(), vue.createBlock(_component_GlobalSearch, { key: 0 })) : vue.createCommentVNode("", true),
        _ctx.getBindValues.useAdvancedSearch ? (vue.openBlock(), vue.createBlock(_component_AdvancedSearchSetting, {
            key: 1,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["getPopupContainer"])) : vue.createCommentVNode("", true),
        ((_b = (_a2 = _ctx.getBindValues) == null ? void 0 : _a2.formConfig) == null ? void 0 : _b.schemas) && ((_e = (_d = (_c = _ctx.getBindValues) == null ? void 0 : _c.formConfig) == null ? void 0 : _d.schemas) == null ? void 0 : _e.length) !== 0 ? (vue.openBlock(), vue.createBlock(_component_ShowSearchSetting, {
            key: 2,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["getPopupContainer"])) : vue.createCommentVNode("", true),
        _ctx.getSetting.size ? (vue.openBlock(), vue.createBlock(_component_SizeSetting, {
            key: 3,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["getPopupContainer"])) : vue.createCommentVNode("", true),
        _ctx.getSetting.setting ? (vue.openBlock(), vue.createBlock(_component_ColumnSetting, {
            key: 4,
            onColumnsChange: _ctx.handleColumnChange,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["onColumnsChange", "getPopupContainer"])) : vue.createCommentVNode("", true),
        _ctx.getSetting.fullScreen ? (vue.openBlock(), vue.createBlock(_component_FullScreenSetting, {
            key: 5,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["getPopupContainer"])) : vue.createCommentVNode("", true)
    ]);
}
const TableSettingComponent = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$n]]);
const _sfc_main$u = vue.defineComponent({
    name: "BasicTableHeader",
    components: {
        // Divider,
        // TableTitle,
        TableSetting: TableSettingComponent
    },
    props: {
        title: {
            type: [Function, String]
        },
        tableSetting: {
            type: Object
        },
        showTableSetting: {
            type: Boolean
        },
        titleHelpMessage: {
            type: [String, Array],
            default: ""
        }
    },
    emits: ["columns-change"],
    setup(_, { emit }) {
        const { prefixCls: prefixCls2 } = use.useDesign("basic-table-header");
        function handleColumnChange(data) {
            emit("columns-change", data);
        }
        return { prefixCls: prefixCls2, handleColumnChange };
    }
});
const TableHeader_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$h = { style: { "width": "100%" } };
const _hoisted_2$5 = {
    key: 0,
    style: { "margin": "5px" }
};
const _hoisted_3$3 = { class: "flex items-center" };
function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_TableSetting = vue.resolveComponent("TableSetting");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$h, [
        _ctx.$slots.headerTop ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$5, [
            vue.renderSlot(_ctx.$slots, "headerTop")
        ])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_3$3, [
            _ctx.$slots.tableTitle ? vue.renderSlot(_ctx.$slots, "tableTitle", { key: 0 }) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", {
                class: vue.normalizeClass(`${_ctx.prefixCls}__toolbar`)
            }, [
                vue.createElementVNode("div", {
                    class: vue.normalizeClass(`${_ctx.prefixCls}__button`)
                }, [
                    vue.renderSlot(_ctx.$slots, "toolbar")
                ], 2),
                _ctx.showTableSetting ? (vue.openBlock(), vue.createBlock(_component_TableSetting, {
                    key: 0,
                    setting: _ctx.tableSetting,
                    onColumnsChange: _ctx.handleColumnChange
                }, null, 8, ["setting", "onColumnsChange"])) : vue.createCommentVNode("", true)
            ], 2)
        ])
    ]);
}
const TableHeader = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$m]]);
function useTableHeader(propsRef, slots, handlers2) {
    const getHeaderProps = vue.computed(() => {
        const { title, showTableSetting, titleHelpMessage, tableSetting } = vue.unref(propsRef);
        const hideTitle = !slots.tableTitle && !title && !slots.toolbar && !showTableSetting;
        if (hideTitle && !utils.isString(title)) {
            return {};
        }
        return {
            title: hideTitle ? null : () => vue.h(
                TableHeader,
                {
                    title,
                    titleHelpMessage,
                    showTableSetting,
                    tableSetting,
                    onColumnsChange: handlers2.onColumnsChange
                },
                {
                    ...slots.toolbar ? {
                        toolbar: () => utils.getSlot(slots, "toolbar")
                    } : {},
                    ...slots.tableTitle ? {
                        tableTitle: () => utils.getSlot(slots, "tableTitle")
                    } : {},
                    ...slots.headerTop ? {
                        headerTop: () => utils.getSlot(slots, "headerTop")
                    } : {}
                }
            )
        };
    });
    return { getHeaderProps };
}
function useTableExpand(propsRef, tableData, emit) {
    const expandedRowKeys = vue.ref([]);
    const getAutoCreateKey = vue.computed(() => {
        return vue.unref(propsRef).autoCreateKey && !vue.unref(propsRef).rowKey;
    });
    const getRowKey = vue.computed(() => {
        const { rowKey } = vue.unref(propsRef);
        return vue.unref(getAutoCreateKey) ? ROW_KEY : rowKey;
    });
    const getExpandOption = vue.computed(() => {
        const { isTreeTable } = vue.unref(propsRef);
        if (!isTreeTable)
            return {};
        return {
            expandedRowKeys: vue.unref(expandedRowKeys),
            onExpandedRowsChange: (keys2) => {
                expandedRowKeys.value = keys2;
                emit("expanded-rows-change", keys2);
            }
        };
    });
    function expandAll() {
        const keys2 = getAllKeys2();
        expandedRowKeys.value = keys2;
    }
    function expandRows(keys2) {
        const { isTreeTable } = vue.unref(propsRef);
        if (!isTreeTable)
            return;
        expandedRowKeys.value = [...expandedRowKeys.value, ...keys2];
    }
    function getAllKeys2(data) {
        const keys2 = [];
        const { childrenColumnName } = vue.unref(propsRef);
        vue.toRaw(data || vue.unref(tableData)).forEach((item) => {
            keys2.push(item[vue.unref(getRowKey)]);
            const children = item[childrenColumnName || "children"];
            if (children == null ? void 0 : children.length) {
                keys2.push(...getAllKeys2(children));
            }
        });
        return keys2;
    }
    function collapseAll() {
        expandedRowKeys.value = [];
    }
    return { getExpandOption, expandAll, expandRows, collapseAll };
}
const SUMMARY_ROW_KEY = "_row";
const SUMMARY_INDEX_KEY = "_index";
const _sfc_main$t = vue.defineComponent({
    name: "BasicTableFooter",
    components: { Table: antDesignVue.Table },
    props: {
        summaryFunc: {
            type: Function
        },
        summaryData: {
            type: Array
        },
        scroll: {
            type: Object
        },
        rowKey: {
            type: String,
            default: "key"
        }
    },
    setup(props2) {
        const table2 = useTableContext();
        const getDataSource = vue.computed(() => {
            const { summaryFunc, summaryData } = props2;
            if (summaryData == null ? void 0 : summaryData.length) {
                summaryData.forEach((item, i) => item[props2.rowKey] = `${i}`);
                return summaryData;
            }
            if (!utils.isFunction(summaryFunc)) {
                return [];
            }
            let dataSource = vue.toRaw(vue.unref(table2.getDataSource()));
            dataSource = summaryFunc(dataSource);
            dataSource.forEach((item, i) => {
                item[props2.rowKey] = `${i}`;
            });
            return dataSource;
        });
        const getColumns = vue.computed(() => {
            const dataSource = vue.unref(getDataSource);
            const columns = cloneDeep(table2.getColumns());
            const index2 = columns.findIndex((item) => item.flag === INDEX_COLUMN_FLAG);
            const hasRowSummary = dataSource.some(
                (item) => Reflect.has(item, SUMMARY_ROW_KEY)
            );
            const hasIndexSummary = dataSource.some(
                (item) => Reflect.has(item, SUMMARY_INDEX_KEY)
            );
            if (index2 !== -1) {
                if (hasIndexSummary) {
                    columns[index2].customRender = ({ record }) => record[SUMMARY_INDEX_KEY];
                    columns[index2].ellipsis = false;
                } else {
                    Reflect.deleteProperty(columns[index2], "customRender");
                }
            }
            if (table2.getRowSelection() && hasRowSummary) {
                const isFixed = columns.some((col) => col.fixed === "left");
                columns.unshift({
                    width: 60,
                    title: "selection",
                    key: "selectionKey",
                    align: "center",
                    ...isFixed ? { fixed: "left" } : {},
                    customRender: ({ record }) => record[SUMMARY_ROW_KEY]
                });
            }
            return columns;
        });
        return { getColumns, getDataSource };
    }
});
function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Table = vue.resolveComponent("Table");
    return _ctx.summaryFunc || _ctx.summaryData ? (vue.openBlock(), vue.createBlock(_component_Table, {
        key: 0,
        showHeader: false,
        bordered: false,
        pagination: false,
        dataSource: _ctx.getDataSource,
        rowKey: (r) => r[_ctx.rowKey],
        columns: _ctx.getColumns,
        tableLayout: "fixed",
        scroll: _ctx.scroll
    }, null, 8, ["dataSource", "rowKey", "columns", "scroll"])) : vue.createCommentVNode("", true);
}
const TableFooter = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$l]]);
function useTableFooter(propsRef, scrollRef, tableElRef, getDataSourceRef) {
    const getIsEmptyData = vue.computed(() => {
        return (vue.unref(getDataSourceRef) || []).length === 0;
    });
    const getFooterProps = vue.computed(() => {
        const { summaryFunc, showSummary, summaryData } = vue.unref(propsRef);
        return showSummary && !vue.unref(getIsEmptyData) ? () => vue.h(TableFooter, { summaryFunc, summaryData, scroll: vue.unref(scrollRef) }) : void 0;
    });
    vue.watchEffect(() => {
        handleSummary();
    });
    function handleSummary() {
        const { showSummary } = vue.unref(propsRef);
        if (!showSummary || vue.unref(getIsEmptyData))
            return;
        vue.nextTick(() => {
            const tableEl = vue.unref(tableElRef);
            if (!tableEl)
                return;
            const bodyDom = tableEl.$el.querySelector(".ant-table-content");
            use.useEventListener({
                el: bodyDom,
                name: "scroll",
                listener: () => {
                    const footerBodyDom = tableEl.$el.querySelector(
                        ".ant-table-footer .ant-table-content"
                    );
                    if (!footerBodyDom || !bodyDom)
                        return;
                    footerBodyDom.scrollLeft = bodyDom.scrollLeft;
                },
                wait: 0,
                options: true
            });
        });
    }
    return { getFooterProps };
}
function useTableForm(propsRef, slots, fetch, getLoading) {
    const getFormConfig = vue.computed(() => {
        const { formConfig } = vue.unref(propsRef);
        const temp = cloneDeep(formConfig);
        temp == null ? void 0 : temp.schemas.forEach((item) => {
            if (item.component === "Input") {
                item.componentProps = {
                    showCount: false,
                    ...(item == null ? void 0 : item.componentProps) || {}
                };
            }
        });
        return temp;
    });
    const getFormProps = vue.computed(() => {
        const { formConfig } = vue.unref(propsRef);
        const { submitButtonOptions } = formConfig || {};
        return {
            showAdvancedButton: true,
            rowProps: { gutter: 20 },
            ...getFormConfig.value,
            submitButtonOptions: {
                loading: vue.unref(getLoading),
                ...submitButtonOptions
            },
            compact: true
        };
    });
    const getFormSlotKeys = vue.computed(() => {
        const keys2 = Object.keys(slots);
        return keys2.map((item) => item.startsWith("form-") ? item : null).filter((item) => !!item);
    });
    function replaceFormSlotKey(key2) {
        var _a2;
        if (!key2)
            return "";
        return ((_a2 = key2 == null ? void 0 : key2.replace) == null ? void 0 : _a2.call(key2, /form-/, "")) ?? "";
    }
    function handleSearchInfoChange(info) {
        const { handleSearchInfoFn } = vue.unref(propsRef);
        if (handleSearchInfoFn && utils.isFunction(handleSearchInfoFn)) {
            info = handleSearchInfoFn(info) || info;
        }
        fetch({ searchInfo: info, page: 1 });
    }
    return {
        getFormProps,
        replaceFormSlotKey,
        getFormSlotKeys,
        handleSearchInfoChange
    };
}
const useAdvancedSearch = ({ getProps, reload }) => {
    const isVisibleAdvancedSearch = vue.ref(false);
    const schemasAdvancedSearch = vue.computed(() => {
        return getProps.value.columns.map((column) => {
            return {
                label: column.title,
                field: column.dataIndex,
                type: (column == null ? void 0 : column.advancedType) || "string",
                component: (column == null ? void 0 : column.component) || "Input",
                componentProps: (column == null ? void 0 : column.componentProps) || {},
                sortShow: (column == null ? void 0 : column.sortShow) === void 0 ? true : column.sortShow,
                globalShow: (column == null ? void 0 : column.globalShow) === void 0 ? true : column.globalShow,
                advancedShow: (column == null ? void 0 : column.advancedShow) === void 0 ? true : column.advancedShow
            };
        });
    });
    const schemasAdvancedSearchGlobal = vue.computed(() => {
        return schemasAdvancedSearch.value.filter((item) => {
            return item.globalShow;
        });
    });
    const schemasAdvancedSearchString = vue.computed(() => {
        return schemasAdvancedSearch.value.filter((item) => {
            return item.type === "string";
        });
    });
    const openAdvancedSearch = () => {
        isVisibleAdvancedSearch.value = true;
    };
    const closeAdvancedSearch = () => {
        isVisibleAdvancedSearch.value = false;
    };
    const handleAdvancedEnsure = (form) => {
        setCurSearchParams(form);
        reload({ searchInfo: form });
    };
    const globalSearchType = vue.ref(1);
    const isVisibleGlobalSearch = vue.ref(false);
    const openGlobalSearch = () => {
        isVisibleGlobalSearch.value = true;
    };
    const closeGlobalSearch = () => {
        isVisibleGlobalSearch.value = false;
    };
    const setGlobalSearchType = (value) => {
        globalSearchType.value = value;
    };
    const getGlobalSearchType = () => {
        return globalSearchType.value;
    };
    const curGlobalSchemas = vue.ref([]);
    const setGlobalSchemas = (value) => {
        curGlobalSchemas.value = value;
    };
    const getGlobalSchemas = () => {
        return curGlobalSchemas.value;
    };
    const curGlobalSearchValue = vue.ref("");
    const setGlobalSearchValue = (value) => {
        curGlobalSearchValue.value = value;
    };
    const getGlobalSearchValue = () => {
        return curGlobalSearchValue.value;
    };
    const curSearchParams = vue.ref({});
    const setCurSearchParams = (value) => {
        curSearchParams.value = value;
    };
    const getCurSearchParams = () => {
        return curSearchParams.value;
    };
    return {
        isVisibleAdvancedSearch,
        schemasAdvancedSearch,
        openAdvancedSearch,
        closeAdvancedSearch,
        handleAdvancedEnsure,
        setGlobalSearchType,
        getGlobalSearchType,
        openGlobalSearch,
        closeGlobalSearch,
        isVisibleGlobalSearch,
        curGlobalSearchValue,
        setGlobalSchemas,
        getGlobalSchemas,
        setGlobalSearchValue,
        getGlobalSearchValue,
        setCurSearchParams,
        getCurSearchParams,
        schemasAdvancedSearchString,
        schemasAdvancedSearchGlobal
    };
};
const basicProps$3 = vue.reactive({
    clickToRowSelect: { type: Boolean, default: true },
    isTreeTable: Boolean,
    tableSetting: {
        type: Object,
        default: () => {
            return {};
        }
    },
    inset: Boolean,
    sortFn: {
        type: Function,
        default: DEFAULT_SORT_FN
    },
    filterFn: {
        type: Function,
        default: DEFAULT_FILTER_FN
    },
    showTableSetting: { type: Boolean, default: true },
    autoCreateKey: { type: Boolean, default: true },
    striped: { type: Boolean, default: false },
    showSummary: Boolean,
    summaryFunc: {
        type: [Function, Array],
        default: null
    },
    summaryData: {
        type: Array,
        default: null
    },
    indentSize: {
        type: Number,
        default: 24
    },
    canColDrag: { type: Boolean, default: true },
    api: {
        type: Function,
        default: null
    },
    beforeFetch: {
        type: Function,
        default: null
    },
    afterFetch: {
        type: Function,
        default: null
    },
    handleSearchInfoFn: {
        type: Function,
        default: null
    },
    fetchSetting: {
        type: Object,
        default: () => {
            return FETCH_SETTING;
        }
    },
    // 立即请求接口
    immediate: { type: Boolean, default: true },
    emptyDataIsShowTable: { type: Boolean, default: true },
    // 额外的请求参数
    searchInfo: {
        type: Object,
        default: null
    },
    // 默认的排序参数
    defSort: {
        type: Object,
        default: null
    },
    // 使用搜索表单
    useSearchForm: {
        type: Boolean
    },
    //使用高级搜索
    useAdvancedSearch: {
        type: Boolean,
        default: false
    },
    // 使用表格内边距
    useTableWrapper: {
        type: Boolean,
        default: true
    },
    // 表单配置
    formConfig: {
        type: Object,
        default: null
    },
    columns: {
        type: [Array],
        default: () => []
    },
    showIndexColumn: { type: Boolean, default: false },
    indexColumnProps: {
        type: Object,
        default: null
    },
    actionColumn: {
        type: Object,
        default: null
    },
    ellipsis: { type: Boolean, default: true },
    isCanResizeParent: { type: Boolean, default: false },
    canResize: { type: Boolean, default: true },
    clearSelectOnPageChange: {
        type: Boolean
    },
    resizeHeightOffset: {
        type: Number,
        default: 0
    },
    rowSelection: {
        type: Object,
        default: null
    },
    title: {
        type: [String, Function],
        default: null
    },
    titleHelpMessage: {
        type: [String, Array]
    },
    maxHeight: {
        type: Number
    },
    dataSource: {
        type: Array,
        default: null
    },
    rowKey: {
        type: [String, Function],
        default: ""
    },
    bordered: {
        type: Boolean,
        default: false
    },
    pagination: {
        type: [Object, Boolean],
        default: true
    },
    loading: {
        type: Boolean
    },
    rowClassName: {
        type: Function
    },
    scroll: {
        type: Object,
        default: null
    },
    beforeEditSubmit: {
        type: Function
    },
    size: {
        type: String,
        default: DEFAULT_SIZE
    }
});
const basicPropChange = (options) => {
    Object.keys(options).forEach((name) => {
        basicProps$3[name] = options[name];
    });
};
const _sfc_main$s = vue.defineComponent({
    props: {
        schemasAdvancedSearch: {
            default: () => [],
            type: Array
        }
    },
    components: {
        BasicButton: _sfc_main$Y,
        Space: antDesignVue.Space,
        AdvancedSearch: _sfc_main$x
    },
    emits: ["ensure"],
    setup(_, { emit }) {
        const advancedSearchRef = vue.ref();
        const table2 = useTableContext();
        const setStyle2 = () => {
            const dom = document.querySelector(".table-settings");
            if (dom) {
                return { left: `${dom.offsetLeft - 370}px` };
            } else {
                return {};
            }
        };
        const handleEnsure = () => {
            const form = advancedSearchRef.value.getSearchFrom();
            emit("ensure", form);
        };
        const handleReset = () => {
            advancedSearchRef.value.resetFields();
        };
        const tableAdvancedSearchWrapperRef = vue.ref();
        const clickOutside = (e) => {
            var _a2;
            if (tableAdvancedSearchWrapperRef.value.contains(e.target))
                return;
            if ((_a2 = document.querySelector(".table-settings")) == null ? void 0 : _a2.contains(e.target))
                return;
            if (e.target.classList.contains("shy-basic-minus-icon"))
                return;
            if (e.target.nodeName === "BODY")
                return;
            const selectList = document.getElementsByClassName("ant-select-dropdown");
            const pickList = document.getElementsByClassName("ant-picker-dropdown");
            const domList = [...Array.from(selectList), ...Array.from(pickList)];
            const flag = (domList == null ? void 0 : domList.length) && domList.some((dom) => {
                return dom.contains(e.target);
            });
            if (flag)
                return;
            table2.closeAdvancedSearch();
        };
        vue.onMounted(() => {
            document.addEventListener("click", clickOutside);
        });
        vue.onUnmounted(() => {
            document.removeEventListener("click", clickOutside);
        });
        return {
            handleEnsure,
            handleReset,
            advancedSearchRef,
            setStyle: setStyle2,
            tableAdvancedSearchWrapperRef
        };
    }
});
const _hoisted_1$g = { class: "shy-basic-table-advanced-search-footer" };
function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_AdvancedSearch = vue.resolveComponent("AdvancedSearch");
    const _component_BasicButton = vue.resolveComponent("BasicButton");
    const _component_Space = vue.resolveComponent("Space");
    return vue.openBlock(), vue.createElementBlock("div", {
        class: "shy-basic-table-advanced-search",
        ref: "tableAdvancedSearchWrapperRef",
        style: vue.normalizeStyle(_ctx.setStyle())
    }, [
        vue.createVNode(_component_AdvancedSearch, {
            ref: "advancedSearchRef",
            schemas: _ctx.schemasAdvancedSearch
        }, null, 8, ["schemas"]),
        vue.createElementVNode("div", _hoisted_1$g, [
            vue.createVNode(_component_Space, null, {
                default: vue.withCtx(() => [
                    vue.createVNode(_component_BasicButton, {
                        type: "primary",
                        onClick: _ctx.handleEnsure
                    }, {
                        default: vue.withCtx(() => [
                            vue.createTextVNode("搜索")
                        ]),
                        _: 1
                    }, 8, ["onClick"]),
                    vue.createVNode(_component_BasicButton, { onClick: _ctx.handleReset }, {
                        default: vue.withCtx(() => [
                            vue.createTextVNode("重置")
                        ]),
                        _: 1
                    }, 8, ["onClick"])
                ]),
                _: 1
            })
        ])
    ], 4);
}
const TableAdvancedSearch = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$k]]);
const _sfc_main$r = vue.defineComponent({
    props: {
        schemasAdvancedSearch: {
            default: () => [],
            type: Array
        }
    },
    components: { CheckboxGroup: antDesignVue.CheckboxGroup, Checkbox: antDesignVue.Checkbox, CheckOutlined: CheckOutlined$1 },
    emits: ["ensure"],
    setup(props2) {
        const table2 = useTableContext();
        const advancedSearchRef = vue.ref();
        const fieldList = vue.ref([]);
        const curSelected = vue.ref(1);
        vue.watch(
            curSelected,
            (value) => {
                table2.setGlobalSearchType(value);
            },
            { immediate: true }
        );
        table2.setGlobalSchemas(props2.schemasAdvancedSearch);
        const handleSelectedClick = (value) => {
            curSelected.value = value;
            if (value === 1) {
                table2.setGlobalSchemas(props2.schemasAdvancedSearch);
                const searchValue = table2.getGlobalSearchValue();
                const schemas = props2.schemasAdvancedSearch.map((item) => {
                    return item.field;
                });
                if (!searchValue)
                    return;
                const params = getGlobalAdvancedType(schemas, searchValue);
                table2.reload({ searchInfo: { ...params } });
                table2.setCurSearchParams(params);
            } else {
                table2.setGlobalSchemas(fieldList.value);
                const searchValue = table2.getGlobalSearchValue();
                if (!searchValue)
                    return;
                if (fieldList.value.length === 0)
                    return;
                const params = getGlobalAdvancedType(fieldList.value, searchValue);
                table2.reload({ searchInfo: { ...params } });
                table2.setCurSearchParams(params);
            }
        };
        const handleCheckboxChange = (value) => {
            curSelected.value = 2;
            table2.setGlobalSchemas(value);
            const searchValue = table2.getGlobalSearchValue();
            if (!searchValue)
                return;
            if (value.length === 0)
                return;
            const params = getGlobalAdvancedType(value, searchValue);
            table2.reload({ searchInfo: { ...params } });
            table2.setCurSearchParams(params);
        };
        const handleReset = () => {
            advancedSearchRef.value.resetFields();
        };
        const setStyle2 = () => {
            const dom = document.querySelector(".table-settings");
            if (dom) {
                return { left: `${dom.offsetLeft}px` };
            } else {
                return {};
            }
        };
        const globalSearchWrapperRef = vue.ref();
        const clickOutside = (e) => {
            var _a2;
            if ((_a2 = document.querySelector(".table-settings")) == null ? void 0 : _a2.contains(e.target))
                return;
            if (globalSearchWrapperRef.value.contains(e.target))
                return;
            table2.closeGlobalSearch();
        };
        vue.onMounted(() => {
            document.addEventListener("click", clickOutside);
        });
        vue.onUnmounted(() => {
            document.removeEventListener("click", clickOutside);
        });
        return {
            handleReset,
            advancedSearchRef,
            fieldList,
            curSelected,
            handleSelectedClick,
            handleCheckboxChange,
            setStyle: setStyle2,
            globalSearchWrapperRef
        };
    }
});
const TableGlobalSearch_vue_vue_type_style_index_0_scoped_90331d26_lang = "";
const _withScopeId = (n) => (vue.pushScopeId("data-v-90331d26"), n = n(), vue.popScopeId(), n);
const _hoisted_1$f = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", null, "搜索全部", -1));
const _hoisted_2$4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", null, "搜索特定字段", -1));
const _hoisted_3$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", null, null, -1));
const _hoisted_4$2 = { class: "shy-basic-table-global-search-checkbox-wrapper" };
const _hoisted_5$1 = { style: { "color": "#131415", "font-size": "12px" } };
function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CheckOutlined = vue.resolveComponent("CheckOutlined");
    const _component_Checkbox = vue.resolveComponent("Checkbox");
    const _component_CheckboxGroup = vue.resolveComponent("CheckboxGroup");
    return vue.openBlock(), vue.createElementBlock("div", {
        class: "shy-basic-table-global-search",
        style: vue.normalizeStyle(_ctx.setStyle()),
        ref: "globalSearchWrapperRef"
    }, [
        vue.createElementVNode("div", {
            class: vue.normalizeClass(["shy-basic-table-global-search-item-global", { "selected-bg": _ctx.curSelected === 1 }]),
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleSelectedClick(1))
        }, [
            _hoisted_1$f,
            _ctx.curSelected === 1 ? (vue.openBlock(), vue.createBlock(_component_CheckOutlined, { key: 0 })) : vue.createCommentVNode("", true)
        ], 2),
        vue.createElementVNode("div", {
            class: vue.normalizeClass(["shy-basic-table-global-search-item-special", { "selected-bg": _ctx.curSelected === 2 }]),
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.handleSelectedClick(2))
        }, [
            _hoisted_2$4,
            _ctx.curSelected === 2 ? (vue.openBlock(), vue.createBlock(_component_CheckOutlined, { key: 0 })) : vue.createCommentVNode("", true)
        ], 2),
        _hoisted_3$2,
        vue.createElementVNode("div", _hoisted_4$2, [
            vue.createVNode(_component_CheckboxGroup, {
                value: _ctx.fieldList,
                "onUpdate:value": _cache[2] || (_cache[2] = ($event) => _ctx.fieldList = $event),
                onChange: _ctx.handleCheckboxChange
            }, {
                default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.schemasAdvancedSearch, (item, index2) => {
                        return vue.openBlock(), vue.createElementBlock("div", {
                            key: index2,
                            style: { "height": "22px" }
                        }, [
                            vue.createVNode(_component_Checkbox, {
                                value: item.field
                            }, {
                                default: vue.withCtx(() => [
                                    vue.createElementVNode("span", _hoisted_5$1, vue.toDisplayString(item.label), 1)
                                ]),
                                _: 2
                            }, 1032, ["value"])
                        ]);
                    }), 128))
                ]),
                _: 1
            }, 8, ["value", "onChange"])
        ])
    ], 4);
}
const TableGlobalSearch = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$j], ["__scopeId", "data-v-90331d26"]]);
const _sfc_main$q = vue.defineComponent({
    components: {
        TableAdvancedSearch,
        Table: antDesignVue.Table,
        BasicForm,
        HeaderCell: _sfc_main$E,
        Empty: antDesignVue.Empty,
        TableGlobalSearch
    },
    props: basicProps$3,
    emits: [
        "fetch-success",
        "fetch-error",
        "selection-change",
        "register",
        "row-click",
        "row-dbClick",
        "row-contextmenu",
        "row-mouseenter",
        "row-mouseleave",
        "edit-end",
        "edit-cancel",
        "edit-row-end",
        "edit-change",
        "expanded-rows-change",
        "change",
        "columns-change"
    ],
    setup(props2, { attrs, emit, slots, expose }) {
        const tableElRef = vue.ref(null);
        const tableData = vue.ref([]);
        const wrapRef = vue.ref(null);
        const formRef = vue.ref(null);
        const innerPropsRef = vue.ref();
        const prefixCls2 = "shy-basic-table";
        const [registerForm, formActions] = useForm();
        const { config } = useGlobalConfig("table");
        const getProps = vue.computed(() => {
            return { ...props2, ...config, ...vue.unref(innerPropsRef) };
        });
        const isFixedHeightPage = vue.inject(PageWrapperFixedHeightKey, false);
        vue.watchEffect(() => {
            vue.unref(isFixedHeightPage) && props2.canResize && utils.warn(
                "'canResize' of BasicTable may not work in PageWrapper with 'fixedHeight' (especially in hot updates)"
            );
        });
        const { getLoading, setLoading } = useLoading$1(getProps);
        const {
            getPaginationInfo,
            getPagination,
            setPagination,
            setShowPagination,
            getShowPagination
        } = usePagination$1(getProps);
        const {
            getRowSelection,
            getRowSelectionRef,
            getSelectRows,
            setSelectedRows,
            clearSelectedRowKeys,
            getSelectRowKeys,
            deleteSelectRowByKey,
            setSelectedRowKeys
        } = useRowSelection(getProps, tableData, emit);
        const {
            handleTableChange: onTableChange,
            getDataSourceRef,
            getDataSource,
            getRawDataSource,
            setTableData,
            updateTableDataRecord,
            deleteTableDataRecord,
            insertTableDataRecord,
            findTableDataRecord,
            fetch,
            getRowKey,
            reload,
            getAutoCreateKey,
            updateTableData
        } = useDataSource(
            getProps,
            {
                tableData,
                getPaginationInfo,
                setLoading,
                setPagination,
                getFieldsValue: formActions.getFieldsValue,
                clearSelectedRowKeys,
                getCurSearchParams
            },
            emit
        );
        function handleTableChange(...args) {
            onTableChange.call(void 0, ...args);
            emit("change", ...args);
            const { onChange } = vue.unref(getProps);
            onChange && utils.isFunction(onChange) && onChange.call(void 0, ...args);
        }
        const tableActionRef = vue.computed(() => tableAction);
        const {
            getViewColumns,
            getColumns,
            setCacheColumnsByField,
            setColumns,
            getColumnsRef,
            getCacheColumns
        } = useColumns$1(getProps, getPaginationInfo, tableActionRef);
        const { getScrollRef, redoHeight } = useTableScroll(
            getProps,
            tableElRef,
            getColumnsRef,
            getRowSelectionRef,
            getDataSourceRef,
            wrapRef,
            formRef
        );
        const { scrollTo } = useTableScrollTo(tableElRef, getDataSourceRef);
        const { customRow } = useCustomRow(getProps, {
            setSelectedRowKeys,
            getSelectRowKeys,
            clearSelectedRowKeys,
            getAutoCreateKey,
            emit
        });
        const { getRowClassName } = useTableStyle(getProps, prefixCls2);
        const { getExpandOption, expandAll, expandRows, collapseAll } = useTableExpand(getProps, tableData, emit);
        const handlers2 = {
            onColumnsChange: (data) => {
                var _a2, _b;
                emit("columns-change", data);
                (_b = (_a2 = vue.unref(getProps)).onColumnsChange) == null ? void 0 : _b.call(_a2, data);
            }
        };
        const { getHeaderProps } = useTableHeader(getProps, slots, handlers2);
        const { getFooterProps } = useTableFooter(
            getProps,
            getScrollRef,
            tableElRef,
            getDataSourceRef
        );
        const {
            getFormProps,
            replaceFormSlotKey,
            getFormSlotKeys,
            handleSearchInfoChange
        } = useTableForm(getProps, slots, fetch, getLoading);
        const getBindValues = vue.computed(() => {
            const dataSource = vue.unref(getDataSourceRef);
            let propsData = {
                ...attrs,
                customRow,
                ...vue.unref(getProps),
                ...vue.unref(getHeaderProps),
                scroll: vue.unref(getScrollRef),
                loading: vue.unref(getLoading),
                tableLayout: "fixed",
                rowSelection: vue.unref(getRowSelectionRef),
                rowKey: vue.unref(getRowKey),
                // @ts-ignore
                columns: vue.toRaw(vue.unref(getViewColumns)),
                pagination: vue.toRaw(vue.unref(getPaginationInfo)),
                dataSource,
                footer: vue.unref(getFooterProps),
                ...vue.unref(getExpandOption),
                // 默认项
                showSorterTooltip: false
            };
            propsData = omit$1(propsData, ["class", "onChange"]);
            return propsData;
        });
        const getWrapperClass = vue.computed(() => {
            const values = vue.unref(getBindValues);
            return [
                prefixCls2,
                attrs.class,
                {
                    [`${prefixCls2}-form-container`]: values.useSearchForm,
                    [`${prefixCls2}-table-wrapper`]: values.useTableWrapper,
                    [`${prefixCls2}--inset`]: values.inset
                }
            ];
        });
        const getEmptyDataIsShowTable = vue.computed(() => {
            const { emptyDataIsShowTable, useSearchForm } = vue.unref(getProps);
            if (emptyDataIsShowTable || !useSearchForm) {
                return true;
            }
            return !!vue.unref(getDataSourceRef).length;
        });
        const {
            schemasAdvancedSearch,
            schemasAdvancedSearchString,
            schemasAdvancedSearchGlobal,
            isVisibleAdvancedSearch,
            openAdvancedSearch,
            closeAdvancedSearch,
            handleAdvancedEnsure,
            openGlobalSearch,
            closeGlobalSearch,
            isVisibleGlobalSearch,
            setGlobalSearchType,
            getGlobalSearchType,
            setGlobalSchemas,
            getGlobalSchemas,
            setGlobalSearchValue,
            getGlobalSearchValue,
            setCurSearchParams,
            getCurSearchParams: getCurSearchParamsHooks
        } = useAdvancedSearch({ getProps, reload });
        function getCurSearchParams() {
            return getCurSearchParamsHooks();
        }
        function setProps(props22) {
            innerPropsRef.value = { ...vue.unref(innerPropsRef), ...props22 };
        }
        const tableAction = {
            reload,
            getSelectRows,
            setSelectedRows,
            clearSelectedRowKeys,
            getSelectRowKeys,
            deleteSelectRowByKey,
            setPagination,
            setTableData,
            updateTableDataRecord,
            deleteTableDataRecord,
            insertTableDataRecord,
            findTableDataRecord,
            redoHeight,
            setSelectedRowKeys,
            setColumns,
            setLoading,
            getDataSource,
            getRawDataSource,
            setProps,
            getRowSelection,
            getPaginationRef: getPagination,
            getColumns,
            getCacheColumns,
            emit,
            updateTableData,
            setShowPagination,
            getShowPagination,
            setCacheColumnsByField,
            expandAll,
            expandRows,
            collapseAll,
            scrollTo,
            getSize: () => {
                return vue.unref(getBindValues).size;
            }
        };
        createTableContext({
            ...tableAction,
            wrapRef,
            getBindValues,
            openAdvancedSearch,
            closeAdvancedSearch,
            isVisibleAdvancedSearch,
            openGlobalSearch,
            closeGlobalSearch,
            isVisibleGlobalSearch,
            setGlobalSearchType,
            getGlobalSearchType,
            setGlobalSchemas,
            getGlobalSchemas,
            setGlobalSearchValue,
            getGlobalSearchValue,
            setCurSearchParams,
            getCurSearchParams
        });
        expose(tableAction);
        emit("register", tableAction, formActions);
        const handleResizeColumn = (w, col) => {
            col.width = w;
        };
        const getHeight = vue.computed(() => {
            return vue.unref(getScrollRef);
        });
        return {
            formRef,
            tableElRef,
            getBindValues,
            getLoading,
            registerForm,
            handleSearchInfoChange,
            getEmptyDataIsShowTable,
            handleTableChange,
            getRowClassName,
            wrapRef,
            tableAction,
            redoHeight,
            getFormProps,
            replaceFormSlotKey,
            getFormSlotKeys,
            getWrapperClass,
            columns: getViewColumns,
            handleResizeColumn,
            getHeight,
            schemasAdvancedSearch,
            isVisibleAdvancedSearch,
            handleAdvancedEnsure,
            isVisibleGlobalSearch,
            schemasAdvancedSearchString,
            schemasAdvancedSearchGlobal
        };
    }
});
const _hoisted_1$e = {
    class: "shy-page",
    style: { "padding": "0" }
};
const _hoisted_2$3 = { class: "relative" };
function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BasicForm = vue.resolveComponent("BasicForm");
    const _component_TableAdvancedSearch = vue.resolveComponent("TableAdvancedSearch");
    const _component_TableGlobalSearch = vue.resolveComponent("TableGlobalSearch");
    const _component_HeaderCell = vue.resolveComponent("HeaderCell");
    const _component_Empty = vue.resolveComponent("Empty");
    const _component_Table = vue.resolveComponent("Table");
    return vue.openBlock(), vue.createElementBlock("div", {
        ref: "wrapRef",
        class: vue.normalizeClass(_ctx.getWrapperClass),
        style: { "position": "relative" }
    }, [
        vue.createElementVNode("div", _hoisted_1$e, [
            _ctx.getBindValues.useSearchForm ? (vue.openBlock(), vue.createBlock(_component_BasicForm, vue.mergeProps({
                key: 0,
                ref: "formRef",
                submitOnReset: ""
            }, _ctx.getFormProps, {
                tableAction: _ctx.tableAction,
                onRegister: _ctx.registerForm,
                onSubmit: _ctx.handleSearchInfoChange,
                onAdvancedChange: _ctx.redoHeight
            }), vue.createSlots({ _: 2 }, [
                vue.renderList(_ctx.getFormSlotKeys, (item) => {
                    return {
                        name: _ctx.replaceFormSlotKey(item),
                        fn: vue.withCtx((data) => [
                            vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                        ])
                    };
                })
            ]), 1040, ["tableAction", "onRegister", "onSubmit", "onAdvancedChange"])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_2$3, [
                vue.withDirectives(vue.createVNode(_component_TableAdvancedSearch, {
                    schemasAdvancedSearch: _ctx.schemasAdvancedSearch,
                    onEnsure: _ctx.handleAdvancedEnsure
                }, null, 8, ["schemasAdvancedSearch", "onEnsure"]), [
                    [vue.vShow, _ctx.isVisibleAdvancedSearch]
                ]),
                vue.withDirectives(vue.createVNode(_component_TableGlobalSearch, { schemasAdvancedSearch: _ctx.schemasAdvancedSearchGlobal }, null, 8, ["schemasAdvancedSearch"]), [
                    [vue.vShow, _ctx.isVisibleGlobalSearch]
                ]),
                vue.withDirectives(vue.createVNode(_component_Table, vue.mergeProps({ ref: "tableElRef" }, _ctx.getBindValues, {
                    rowClassName: _ctx.getRowClassName,
                    onChange: _ctx.handleTableChange,
                    onResizeColumn: _ctx.handleResizeColumn,
                    class: "enter-x"
                }), vue.createSlots({
                    headerCell: vue.withCtx(({ column }) => [
                        vue.createVNode(_component_HeaderCell, { column }, null, 8, ["column"])
                    ]),
                    emptyText: vue.withCtx(() => [
                        vue.createElementVNode("div", {
                            class: "flex justify-center items-center",
                            style: vue.normalizeStyle({ height: `${_ctx.getHeight.y - 41}px` })
                        }, [
                            vue.createVNode(_component_Empty)
                        ], 4)
                    ]),
                    bodyCell: vue.withCtx((data) => [
                        vue.renderSlot(_ctx.$slots, "bodyCell", vue.normalizeProps(vue.guardReactiveProps(data || {})))
                    ]),
                    _: 2
                }, [
                    vue.renderList(Object.keys(_ctx.$slots), (item) => {
                        return {
                            name: item,
                            fn: vue.withCtx((data) => [
                                vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                            ])
                        };
                    })
                ]), 1040, ["rowClassName", "onChange", "onResizeColumn"]), [
                    [vue.vShow, _ctx.getEmptyDataIsShowTable]
                ])
            ])
        ])
    ], 2);
}
const BasicTable = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$i]]);
const _sfc_main$p = vue.defineComponent({
    name: "TableImage",
    components: { AImage: antDesignVue.Image, PreviewGroup: antDesignVue.Image.PreviewGroup, Badge: antDesignVue.Badge },
    props: {
        imgList: { type: Array },
        size: {
            type: Number,
            default: 24
        },
        // 是否简单显示（只显示第一张图片）
        simpleShow: {
            type: Boolean
        },
        // 简单模式下是否显示图片数量的badge
        showBadge: {
            type: Boolean,
            default: true
        },
        // 图片间距
        margin: {
            type: Number,
            default: 4
        },
        // src前缀，将会附加在imgList中每一项之前
        srcPrefix: {
            type: String,
            default: ""
        },
        // fallback,加载失败显示图像占位符。
        fallback: {
            type: String,
            default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
        }
    },
    setup(props2) {
        const getWrapStyle = vue.computed(() => {
            const { size } = props2;
            const s = `${size}px`;
            return { height: s, width: s };
        });
        const { prefixCls: prefixCls2 } = use.useDesign("basic-table-img");
        return { prefixCls: prefixCls2, getWrapStyle };
    }
});
const TableImg_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$d = { class: "img-div" };
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_AImage = vue.resolveComponent("AImage");
    const _component_PreviewGroup = vue.resolveComponent("PreviewGroup");
    const _component_Badge = vue.resolveComponent("Badge");
    return _ctx.imgList && _ctx.imgList.length ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass([_ctx.prefixCls, "flex items-center mx-auto"]),
        style: vue.normalizeStyle(_ctx.getWrapStyle)
    }, [
        _ctx.simpleShow ? (vue.openBlock(), vue.createBlock(_component_Badge, {
            key: 0,
            count: !_ctx.showBadge || _ctx.imgList.length == 1 ? 0 : _ctx.imgList.length
        }, {
            default: vue.withCtx(() => [
                vue.createElementVNode("div", _hoisted_1$d, [
                    vue.createVNode(_component_PreviewGroup, null, {
                        default: vue.withCtx(() => [
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.imgList, (img, index2) => {
                                return vue.openBlock(), vue.createBlock(_component_AImage, {
                                    key: img,
                                    width: _ctx.size,
                                    style: vue.normalizeStyle({
                                        display: index2 === 0 ? "" : "none !important"
                                    }),
                                    src: _ctx.srcPrefix + img,
                                    fallback: _ctx.fallback
                                }, null, 8, ["width", "style", "src", "fallback"]);
                            }), 128))
                        ]),
                        _: 1
                    })
                ])
            ]),
            _: 1
        }, 8, ["count"])) : (vue.openBlock(), vue.createBlock(_component_PreviewGroup, { key: 1 }, {
            default: vue.withCtx(() => [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.imgList, (img, index2) => {
                    return vue.openBlock(), vue.createBlock(_component_AImage, {
                        key: img,
                        width: _ctx.size,
                        style: vue.normalizeStyle({ marginLeft: index2 === 0 ? 0 : _ctx.margin + "px" }),
                        src: _ctx.srcPrefix + img,
                        fallback: _ctx.fallback
                    }, null, 8, ["width", "style", "src", "fallback"]);
                }), 128))
            ]),
            _: 1
        }))
    ], 6)) : vue.createCommentVNode("", true);
}
const TableImg = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$h]]);
const _sfc_main$o = vue.defineComponent({
    name: "TableDict",
    components: { Tag: antDesignVue.Tag, Icon: Icon2 },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup() {
    }
});
const TableDict_vue_vue_type_style_index_0_scoped_7d89a0e9_lang = "";
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    var _a2;
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_Tag = vue.resolveComponent("Tag");
    return vue.openBlock(), vue.createElementBlock("div", null, [
        vue.createVNode(_component_Tag, {
            color: (_a2 = _ctx.data) == null ? void 0 : _a2.dictColor
        }, vue.createSlots({
            default: vue.withCtx(() => [
                vue.createTextVNode(" " + vue.toDisplayString(_ctx.data.dictValue), 1)
            ]),
            _: 2
        }, [
            _ctx.data.dictIcon ? {
                name: "icon",
                fn: vue.withCtx(() => {
                    var _a3;
                    return [
                        vue.createVNode(_component_Icon, {
                            icon: (_a3 = _ctx.data) == null ? void 0 : _a3.dictIcon
                        }, null, 8, ["icon"])
                    ];
                }),
                key: "0"
            } : void 0
        ]), 1032, ["color"])
    ]);
}
const TableDict = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$g], ["__scopeId", "data-v-7d89a0e9"]]);
const index$2 = "";
var RoleEnum = /* @__PURE__ */ ((RoleEnum2) => {
    RoleEnum2["SUPER"] = "super";
    RoleEnum2["TEST"] = "test";
    return RoleEnum2;
})(RoleEnum || {});
function useTable(tableProps) {
    const tableRef = vue.ref(null);
    const loadedRef = vue.ref(false);
    const formRef = vue.ref(null);
    let stopWatch;
    function register(instance, formInstance) {
        vue.onUnmounted(() => {
            tableRef.value = null;
            loadedRef.value = null;
        });
        if (vue.unref(loadedRef) && instance === vue.unref(tableRef))
            return;
        tableRef.value = instance;
        formRef.value = formInstance;
        tableProps && instance.setProps(utils.getDynamicProps(tableProps));
        loadedRef.value = true;
        stopWatch == null ? void 0 : stopWatch();
        stopWatch = vue.watch(
            () => tableProps,
            () => {
                tableProps && instance.setProps(utils.getDynamicProps(tableProps));
            },
            {
                immediate: true,
                deep: true
            }
        );
    }
    function getTableInstance() {
        const table2 = vue.unref(tableRef);
        if (!table2) {
            return;
        }
        return table2;
    }
    const methods2 = {
        reload: async (opt) => {
            var _a2;
            return await ((_a2 = getTableInstance()) == null ? void 0 : _a2.reload(opt));
        },
        setProps: (props2) => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.setProps(props2);
        },
        redoHeight: () => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.redoHeight();
        },
        setSelectedRows: (rows) => {
            var _a2;
            return vue.toRaw((_a2 = getTableInstance()) == null ? void 0 : _a2.setSelectedRows(rows));
        },
        setLoading: (loading) => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.setLoading(loading);
        },
        getDataSource: () => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.getDataSource();
        },
        getRawDataSource: () => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.getRawDataSource();
        },
        getColumns: ({ ignoreIndex = false } = {}) => {
            var _a2;
            const columns = ((_a2 = getTableInstance()) == null ? void 0 : _a2.getColumns({ ignoreIndex })) || [];
            return vue.toRaw(columns);
        },
        setColumns: (columns) => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.setColumns(columns);
        },
        setTableData: (values) => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.setTableData(values);
        },
        setPagination: (info) => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.setPagination(info);
        },
        deleteSelectRowByKey: (key2) => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.deleteSelectRowByKey(key2);
        },
        getSelectRowKeys: () => {
            var _a2;
            return vue.toRaw((_a2 = getTableInstance()) == null ? void 0 : _a2.getSelectRowKeys());
        },
        getSelectRows: () => {
            var _a2;
            return vue.toRaw((_a2 = getTableInstance()) == null ? void 0 : _a2.getSelectRows());
        },
        clearSelectedRowKeys: () => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.clearSelectedRowKeys();
        },
        setSelectedRowKeys: (keys2) => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.setSelectedRowKeys(keys2);
        },
        getPaginationRef: () => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.getPaginationRef();
        },
        getSize: () => {
            var _a2;
            return vue.toRaw((_a2 = getTableInstance()) == null ? void 0 : _a2.getSize());
        },
        updateTableData: (index2, key2, value) => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.updateTableData(index2, key2, value);
        },
        deleteTableDataRecord: (rowKey) => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.deleteTableDataRecord(rowKey);
        },
        insertTableDataRecord: (record, index2) => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.insertTableDataRecord(record, index2);
        },
        updateTableDataRecord: (rowKey, record) => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.updateTableDataRecord(rowKey, record);
        },
        findTableDataRecord: (rowKey) => {
            var _a2;
            return (_a2 = getTableInstance()) == null ? void 0 : _a2.findTableDataRecord(rowKey);
        },
        getRowSelection: () => {
            var _a2;
            return vue.toRaw((_a2 = getTableInstance()) == null ? void 0 : _a2.getRowSelection());
        },
        getCacheColumns: () => {
            var _a2;
            return vue.toRaw((_a2 = getTableInstance()) == null ? void 0 : _a2.getCacheColumns());
        },
        getForm: () => {
            return vue.unref(formRef);
        },
        setShowPagination: async (show) => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.setShowPagination(show);
        },
        getShowPagination: () => {
            var _a2;
            return vue.toRaw((_a2 = getTableInstance()) == null ? void 0 : _a2.getShowPagination());
        },
        expandAll: () => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.expandAll();
        },
        expandRows: (keys2) => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.expandRows(keys2);
        },
        collapseAll: () => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.collapseAll();
        },
        scrollTo: (pos) => {
            var _a2;
            (_a2 = getTableInstance()) == null ? void 0 : _a2.scrollTo(pos);
        }
    };
    return [register, methods2];
}
const withInstall$4 = (component) => {
    const comp = component;
    comp.install = (app, options = {}, config = {}) => {
        basicPropChange(options);
        setConstConfig(config);
        app.component("BasicTable", component);
    };
    return component;
};
withInstall$4(BasicTable);
const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    __name: "Table",
    setup(__props, { expose }) {
        const getTableProps = vue.inject("getTableProps");
        const [registerTable, tableAction] = useTable({
            api: () => {
            },
            title: "账号列表",
            rowKey: "id",
            columns: [],
            rowSelection: { type: "radio" },
            clickToRowSelect: true,
            formConfig: {
                labelWidth: 80,
                schemas: []
            },
            showIndexColumn: true,
            // isCanResizeParent: true,
            resizeHeightOffset: 200,
            canResize: true,
            searchInfo: {},
            useSearchForm: false,
            ...vue.unref(getTableProps)
        });
        expose({ ...tableAction });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(BasicTable), { onRegister: vue.unref(registerTable) }, null, 8, ["onRegister"]);
        };
    }
});
const _hoisted_1$c = { class: "wrapper overflow-hidden" };
const _hoisted_2$2 = { class: "table-wrapper" };
const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    __name: "Modal",
    props: {
        title: {
            type: String,
            required: true,
            default: "title"
        }
    },
    emits: ["confirm", "register"],
    setup(__props, { emit }) {
        const props2 = __props;
        const [register, { closeModal }] = useModalInner(async () => {
            await tableRef.value.clearSelectedRowKeys();
            tableRef.value.reload();
            treeRef.value.reload();
        });
        const getTreeProps = vue.inject("getTreeProps");
        const getTableProps = vue.inject("getTableProps");
        const tableRef = vue.ref();
        const treeRef = vue.ref();
        const handleSelect = async (key2) => {
            await tableRef.value.setProps({
                searchInfo: { [vue.unref(getTableProps).searchKey]: key2 }
            });
            tableRef.value.reload();
        };
        const handleComfirm = () => {
            const rows = tableRef.value.getSelectRows();
            closeModal();
            emit("confirm", rows);
        };
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(BasicModal), {
                title: props2.title,
                width: "80%",
                onRegister: vue.unref(register),
                onOk: handleComfirm
            }, {
                default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_1$c, [
                        vue.createVNode(_sfc_main$I, vue.mergeProps(vue.unref(getTreeProps), {
                            class: "tree",
                            ref_key: "treeRef",
                            ref: treeRef,
                            onSelect: handleSelect
                        }), null, 16),
                        vue.createElementVNode("div", _hoisted_2$2, [
                            vue.createVNode(_sfc_main$n, vue.mergeProps(vue.unref(getTableProps), {
                                ref_key: "tableRef",
                                ref: tableRef
                            }), null, 16)
                        ])
                    ])
                ]),
                _: 1
            }, 8, ["title", "onRegister"]);
        };
    }
});
const Modal_vue_vue_type_style_index_0_scoped_4dc415ac_lang = "";
const Modal = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-4dc415ac"]]);
const _hoisted_1$b = { class: "api-modal-select" };
const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    __name: "ApiModalSelect",
    props: {
        value: {
            default: ""
        },
        title: {
            default: "title"
        },
        tableComponentProps: {
            type: Object,
            default: () => ({
                api: () => new Promise((resolve) => {
                    resolve([
                        { a: 1, b: 2, c: 3, d: 4, id: "1" },
                        { a: 1, b: 2, c: 3, d: 4, id: "2" },
                        { a: 1, b: 2, c: 3, d: 4, id: "3" },
                        { a: 1, b: 2, c: 3, d: 4, id: "4" },
                        { a: 1, b: 2, c: 3, d: 4, id: "5" },
                        { a: 1, b: 2, c: 3, d: 4, id: "6" },
                        { a: 1, b: 2, c: 3, d: 4, id: "7" },
                        { a: 1, b: 2, c: 3, d: 4, id: "8" },
                        { a: 1, b: 2, c: 3, d: 4, id: "9" },
                        { a: 1, b: 2, c: 3, d: 4, id: "10" }
                    ]);
                }),
                columns: [
                    { title: "a", dataIndex: "a" },
                    { title: "b", dataIndex: "b" },
                    { title: "c", dataIndex: "c" },
                    { title: "d", dataIndex: "d" }
                ],
                searchKey: "deptId"
            })
        },
        tree: {
            default: () => ({
                fieldNames: { label: "a", value: "id" },
                api: () => new Promise((resolve) => {
                    resolve([
                        {
                            title: "father",
                            key: "1",
                            children: [{ title: "1-son", key: "1-1" }]
                        },
                        {
                            title: "father2",
                            key: "2",
                            children: [{ title: "2-son", key: "2-1" }]
                        }
                    ]);
                })
            })
        },
        selectMode: {
            default: "single",
            type: String
        },
        fieldNames: {
            default: { label: "name", value: "id" }
        },
        readonly: {
            default: false,
            type: Boolean
        }
    },
    emits: ["update:value", "change", "modal-confirm"],
    setup(__props, { expose, emit }) {
        const props2 = __props;
        const [register, { openModal }] = useModal();
        const emitData = vue.ref([]);
        const label = vue.ref("");
        const [state] = use.useRuleFormItem(props2, "value", "change", emitData);
        const getTreeProps = vue.computed(() => {
            return { ...props2.tree };
        });
        const getTableProps = vue.computed(() => {
            return { ...props2.tableComponentProps };
        });
        const getSelectMode = vue.computed(() => {
            return props2.selectMode;
        });
        vue.provide("getTreeProps", getTreeProps);
        vue.provide("getTableProps", getTableProps);
        vue.provide("getSelectMode", getSelectMode);
        vue.watch(
            () => state.value,
            (v) => {
                emit("update:value", v);
            }
        );
        const handleClick = () => {
            openModal(true, {});
        };
        const handleConfirm = (rows) => {
            state.value = rows.map((item) => {
                return item[props2.fieldNames.value];
            }).join(",");
            label.value = rows.map((item) => {
                return item[props2.fieldNames.label];
            }).join(",");
            emit("modal-confirm", rows);
        };
        function handleChange(_, ...args) {
            emitData.value = args;
        }
        const getLabel = () => {
            return vue.unref(label);
        };
        const setLabel = (value) => {
            label.value = value;
        };
        expose({ getLabel, setLabel });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$b, [
                vue.createVNode(vue.unref(antDesignVue.Input), {
                    value: vue.unref(state),
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.isRef(state) ? state.value = $event : null),
                    readonly: props2.readonly,
                    onChange: handleChange
                }, {
                    addonAfter: vue.withCtx(() => [
                        vue.createElementVNode("div", {
                            class: "btn-wrapper",
                            onClick: handleClick
                        }, [
                            vue.createVNode(vue.unref(SmallDashOutlined$1))
                        ])
                    ]),
                    _: 1
                }, 8, ["value", "readonly"]),
                vue.createVNode(vue.unref(antDesignVue.FormItemRest), null, {
                    default: vue.withCtx(() => [
                        vue.createVNode(Modal, {
                            title: __props.title,
                            onRegister: vue.unref(register),
                            onConfirm: handleConfirm
                        }, null, 8, ["title", "onRegister"])
                    ]),
                    _: 1
                })
            ]);
        };
    }
});
const ApiModalSelect_vue_vue_type_style_index_0_scoped_fb4fe18d_lang = "";
const ApiModalSelect = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-fb4fe18d"]]);
const Description$1 = "";
const basicColProps = 24;
const basicProps$2 = {
    schema: {
        type: Array,
        default: () => []
    },
    labelAlign: {
        type: String,
        default: () => "right"
    },
    labelWidth: {
        type: Number,
        default: () => 80
    },
    isShowColon: {
        type: Boolean,
        default: () => true
    },
    data: {
        type: Object,
        default: () => ({})
    },
    customRender: {
        type: Object,
        default: () => null
    }
};
const DescriptionGroup = /* @__PURE__ */ vue.defineComponent({
    props: {
        label: {
            type: String,
            default: () => ""
        }
    },
    setup(props2) {
        return () => vue.createVNode("div", {
            "class": "shy-form-divider"
        }, [props2.label]);
    }
});
const Description = /* @__PURE__ */ vue.defineComponent({
    name: "Description",
    props: basicProps$2,
    emits: ["register"],
    setup(props2, {
        emit,
        slots
    }) {
        const prefixCls2 = "shy-basic-description";
        const {
            createMessage
        } = use.useMessage();
        const getProps = vue.computed(() => {
            return {
                ...props2,
                ...innerProps.value
            };
        });
        const innerProps = vue.ref(null);
        const setDescProps = (props3) => {
            innerProps.value = {
                ...innerProps.value,
                ...props3
            };
        };
        const handleClick = (value) => {
            navigator.clipboard.writeText(value).then(() => {
                createMessage.success("复制成功");
            }, () => {
                createMessage.error("无法复制文本到剪贴板");
            });
        };
        const rows = vue.computed(() => {
            let element = null;
            return getProps.value.schema.map((item) => {
                var _a2, _b, _c, _d, _e, _f, _g, _h;
                if ((item == null ? void 0 : item.component) === "Divider") {
                    return vue.createVNode(antDesignVue.Divider, null, null);
                } else if ((item == null ? void 0 : item.component) === "Group") {
                    return vue.createVNode("div", {
                        "style": {
                            flex: "0 0 100%"
                        }
                    }, [vue.createVNode(DescriptionGroup, {
                        "label": item == null ? void 0 : item.label
                    }, null)]);
                } else {
                    if (item == null ? void 0 : item.customRender) {
                        element = (item == null ? void 0 : item.customRender) ? item.customRender(getProps.value.data) : null;
                    } else {
                        element = slots[`${item.field}Value`] ? (_a2 = slots[`${item.field}Value`]) == null ? void 0 : _a2.call(slots, {
                            model: getProps.value.data,
                            field: getProps.value.data[`${item.field}`]
                        }) : getProps.value.data[`${item.field}`];
                    }
                    return vue.createVNode("div", {
                        "class": `${prefixCls2}-row`,
                        "style": {
                            flex: `0 0 ${(((_b = item == null ? void 0 : item.colProps) == null ? void 0 : _b.span) || basicColProps) / 24 * 100}%`
                        }
                    }, [(slots == null ? void 0 : slots[`${item.field}Label`]) || item.label ? vue.createVNode("span", {
                        "style": {
                            width: `${getProps.value.labelWidth}px`,
                            textAlign: getProps.value.labelAlign,
                            ...((_c = getProps.value) == null ? void 0 : _c.labelStyle) ? (_d = getProps.value) == null ? void 0 : _d.labelStyle : {},
                            ...(item == null ? void 0 : item.labelStyle) ? item == null ? void 0 : item.labelStyle : {}
                        },
                        "class": `${prefixCls2}-label`
                    }, [slots[`${item.field}Label`] ? (_e = slots[`${item.field}Label`]) == null ? void 0 : _e.call(slots, {
                        model: getProps.value.data,
                        field: item.label
                    }) : item.label, ((_f = getProps.value) == null ? void 0 : _f.isShowColon) ? ":" : ""]) : vue.createVNode(vue.Fragment, null, [vue.createTextVNode(" ")]), vue.createVNode("span", {
                        "class": `${prefixCls2}-value`,
                        "style": {
                            ...((_g = getProps.value) == null ? void 0 : _g.contentStyle) ? (_h = getProps.value) == null ? void 0 : _h.contentStyle : {},
                            ...(item == null ? void 0 : item.contentStyle) ? item == null ? void 0 : item.contentStyle : {}
                        }
                    }, [element, (item == null ? void 0 : item.isCopy) ? vue.createVNode("span", {
                        "style": "cursor:pointer;margin-left:5px",
                        "onClick": () => handleClick(getProps.value.data[`${item.field}`])
                    }, [vue.createVNode(CopyOutlined$1, {
                        "style": {
                            color: "#458ef9",
                            marginLeft: "5px"
                        }
                    }, null)]) : null])]);
                }
            });
        });
        emit("register", {
            setDescProps
        });
        return () => vue.createVNode("div", {
            "class": `${prefixCls2}-wrapper`
        }, [rows.value]);
    }
});
function useDescription(props2) {
    if (!vue.getCurrentInstance()) {
        throw new Error(
            "useDescription() can only be used inside setup() or functional components!"
        );
    }
    const desc = vue.ref(null);
    const loaded = vue.ref(false);
    function register(instance) {
        vue.onUnmounted(() => {
            desc.value = null;
            loaded.value = false;
        });
        if (vue.unref(loaded) && instance === vue.unref(desc))
            return;
        desc.value = instance;
        loaded.value = true;
        vue.watch(
            () => props2,
            () => {
                props2 && instance.setDescProps(props2);
            },
            {
                immediate: true,
                deep: true
            }
        );
    }
    const methods2 = {
        setDescProps: (descProps) => {
            var _a2;
            (_a2 = vue.unref(desc)) == null ? void 0 : _a2.setDescProps(descProps);
        }
    };
    return [register, methods2];
}
const footerProps = {
    confirmLoading: { type: Boolean },
    /**
     * @description: Show close button
     */
    showCancelBtn: { type: Boolean, default: true },
    cancelButtonProps: Object,
    cancelText: { type: String, default: "关闭" },
    /**
     * @description: Show confirmation button
     */
    showOkBtn: { type: Boolean, default: true },
    okButtonProps: Object,
    okText: { type: String, default: "确认" },
    okType: { type: String, default: "primary" },
    showFooter: { type: Boolean },
    footerHeight: {
        type: [String, Number],
        default: 60
    }
};
const basicProps$1 = {
    isDetail: { type: Boolean },
    title: { type: String, default: "" },
    loadingText: { type: String },
    showDetailBack: { type: Boolean, default: true },
    visible: { type: Boolean },
    loading: { type: Boolean },
    maskClosable: { type: Boolean, default: true },
    getContainer: {
        type: [Object, String]
    },
    closeFunc: {
        type: [Function, Object],
        default: null
    },
    destroyOnClose: { type: Boolean },
    ...footerProps
};
const _sfc_main$k = vue.defineComponent({
    name: "BasicDrawerFooter",
    props: {
        ...footerProps,
        height: {
            type: String,
            default: "60px"
        }
    },
    emits: ["ok", "close"],
    setup(props2, { emit }) {
        const prefixCls2 = "shy-basic-drawer-footer";
        const getStyle = vue.computed(() => {
            const heightStr = `${props2.height}`;
            return {
                height: heightStr,
                lineHeight: `calc(${heightStr} - 1px)`
            };
        });
        function handleOk() {
            emit("ok");
        }
        function handleClose() {
            emit("close");
        }
        return { handleOk, prefixCls: prefixCls2, handleClose, getStyle };
    }
});
const DrawerFooter_vue_vue_type_style_index_0_lang = "";
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_a_button = vue.resolveComponent("a-button");
    return _ctx.showFooter || _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(_ctx.prefixCls),
        style: vue.normalizeStyle(_ctx.getStyle)
    }, [
        !_ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.renderSlot(_ctx.$slots, "insertFooter"),
            _ctx.showCancelBtn ? (vue.openBlock(), vue.createBlock(_component_a_button, vue.mergeProps({ key: 0 }, _ctx.cancelButtonProps, {
                onClick: _ctx.handleClose,
                class: "mr-2"
            }), {
                default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.cancelText), 1)
                ]),
                _: 1
            }, 16, ["onClick"])) : vue.createCommentVNode("", true),
            vue.renderSlot(_ctx.$slots, "centerFooter"),
            _ctx.showOkBtn ? (vue.openBlock(), vue.createBlock(_component_a_button, vue.mergeProps({
                key: 1,
                type: _ctx.okType,
                onClick: _ctx.handleOk
            }, _ctx.okButtonProps, {
                class: "mr-2",
                loading: _ctx.confirmLoading
            }), {
                default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.okText), 1)
                ]),
                _: 1
            }, 16, ["type", "onClick", "loading"])) : vue.createCommentVNode("", true),
            vue.renderSlot(_ctx.$slots, "appendFooter")
        ], 64)) : vue.renderSlot(_ctx.$slots, "footer", { key: 1 })
    ], 6)) : vue.createCommentVNode("", true);
}
const DrawerFooter = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$f]]);
const _sfc_main$j = vue.defineComponent({
    name: "BasicDrawerHeader",
    components: { BasicTitle: BasicTitle$1, ArrowLeftOutlined: ArrowLeftOutlined$1 },
    props: {
        isDetail: {
            type: Boolean
        },
        showDetailBack: {
            type: Boolean
        },
        title: {
            type: String
        }
    },
    emits: ["close"],
    setup(_, { emit }) {
        const prefixCls2 = "shy-basic-drawer-header";
        function handleClose() {
            emit("close");
        }
        return { prefixCls: prefixCls2, handleClose };
    }
});
const DrawerHeader_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$a = { key: 1 };
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BasicTitle = vue.resolveComponent("BasicTitle");
    const _component_ArrowLeftOutlined = vue.resolveComponent("ArrowLeftOutlined");
    return !_ctx.isDetail ? (vue.openBlock(), vue.createBlock(_component_BasicTitle, {
        key: 0,
        class: vue.normalizeClass(_ctx.prefixCls)
    }, {
        default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "title"),
            vue.createTextVNode(" " + vue.toDisplayString(!_ctx.$slots.title ? _ctx.title : ""), 1)
        ]),
        _: 3
    }, 8, ["class"])) : (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass([_ctx.prefixCls, `${_ctx.prefixCls}--detail`])
    }, [
        vue.createElementVNode("span", {
            class: vue.normalizeClass(`${_ctx.prefixCls}__twrap`)
        }, [
            _ctx.showDetailBack ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClose && _ctx.handleClose(...args))
            }, [
                vue.createVNode(_component_ArrowLeftOutlined, {
                    class: vue.normalizeClass(`${_ctx.prefixCls}__back`)
                }, null, 8, ["class"])
            ])) : vue.createCommentVNode("", true),
            _ctx.title ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$a, vue.toDisplayString(_ctx.title), 1)) : vue.createCommentVNode("", true)
        ], 2),
        vue.createElementVNode("span", {
            class: vue.normalizeClass(`${_ctx.prefixCls}__toolbar`)
        }, [
            vue.renderSlot(_ctx.$slots, "titleToolbar")
        ], 2)
    ], 2));
}
const DrawerHeader = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$e]]);
const _sfc_main$i = vue.defineComponent({
    components: { Drawer: antDesignVue.Drawer, ScrollContainer: ScrollContainer$1, DrawerFooter, DrawerHeader },
    inheritAttrs: false,
    props: basicProps$1,
    emits: ["visible-change", "ok", "close", "register"],
    setup(props2, { emit }) {
        const visibleRef = vue.ref(false);
        const attrs = use.useAttrs();
        const propsRef = vue.ref(null);
        const prefixVar = "shy";
        const prefixCls2 = "shy-basic-drawer";
        const drawerInstance = {
            setDrawerProps,
            emitVisible: void 0
        };
        const instance = vue.getCurrentInstance();
        instance && emit("register", drawerInstance, instance.uid);
        const getMergeProps = vue.computed(() => {
            return {
                ...utils.deepMerge(vue.toRaw(props2), vue.unref(propsRef)),
                ...{ title: props2.title }
            };
        });
        vue.watchEffect(() => {
            getMergeProps.value;
        });
        const getProps = vue.computed(() => {
            const opt = {
                placement: "right",
                ...vue.unref(attrs),
                ...vue.unref(getMergeProps),
                visible: vue.unref(visibleRef)
            };
            opt.title = void 0;
            const { isDetail, width, wrapClassName, getContainer } = opt;
            if (isDetail) {
                if (!width) {
                    opt.width = "100%";
                }
                const detailCls = `${prefixCls2}__detail`;
                opt.class = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;
                if (!getContainer) {
                    opt.getContainer = `.${prefixVar}-layout-content`;
                }
            }
            return opt;
        });
        const getBindValues = vue.computed(() => {
            return {
                ...attrs,
                ...vue.unref(getProps)
            };
        });
        const getFooterHeight = vue.computed(() => {
            const { footerHeight, showFooter } = vue.unref(getProps);
            if (showFooter && footerHeight) {
                return utils.isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace("px", "")}px`;
            }
            return `0px`;
        });
        const getScrollContentStyle = vue.computed(() => {
            const footerHeight = vue.unref(getFooterHeight);
            return {
                position: "relative",
                height: `calc(100% - ${footerHeight})`
            };
        });
        const getLoading = vue.computed(() => {
            var _a2;
            return !!((_a2 = vue.unref(getProps)) == null ? void 0 : _a2.loading);
        });
        vue.watch(
            () => props2.visible,
            (newVal, oldVal) => {
                if (newVal !== oldVal)
                    visibleRef.value = newVal;
            },
            { deep: true }
        );
        vue.watch(
            () => visibleRef.value,
            (visible) => {
                vue.nextTick(() => {
                    emit("visible-change", visible);
                });
            }
        );
        async function onClose(e) {
            const { closeFunc } = vue.unref(getProps);
            emit("close", e);
            if (closeFunc && utils.isFunction(closeFunc)) {
                const res = await closeFunc();
                visibleRef.value = !res;
                return;
            }
            visibleRef.value = false;
        }
        function setDrawerProps(props22) {
            propsRef.value = utils.deepMerge(vue.unref(propsRef) || {}, props22);
            if (Reflect.has(props22, "visible")) {
                visibleRef.value = !!props22.visible;
            }
        }
        function handleOk() {
            emit("ok");
        }
        return {
            onClose,
            prefixCls: prefixCls2,
            getMergeProps,
            getScrollContentStyle,
            getProps,
            getLoading,
            getBindValues,
            getFooterHeight,
            handleOk
        };
    }
});
const BasicDrawer_vue_vue_type_style_index_0_lang = "";
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_DrawerHeader = vue.resolveComponent("DrawerHeader");
    const _component_ScrollContainer = vue.resolveComponent("ScrollContainer");
    const _component_DrawerFooter = vue.resolveComponent("DrawerFooter");
    const _component_Drawer = vue.resolveComponent("Drawer");
    return vue.openBlock(), vue.createBlock(_component_Drawer, vue.mergeProps({
        class: _ctx.prefixCls,
        onClose: _ctx.onClose
    }, _ctx.getBindValues), vue.createSlots({
        default: vue.withCtx(() => [
            vue.createVNode(_component_ScrollContainer, {
                style: vue.normalizeStyle(_ctx.getScrollContentStyle)
            }, {
                default: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
            }, 8, ["style"]),
            vue.createVNode(_component_DrawerFooter, vue.mergeProps(_ctx.getProps, {
                onClose: _ctx.onClose,
                onOk: _ctx.handleOk,
                height: _ctx.getFooterHeight
            }), vue.createSlots({ _: 2 }, [
                vue.renderList(Object.keys(_ctx.$slots), (item) => {
                    return {
                        name: item,
                        fn: vue.withCtx((data) => [
                            vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                        ])
                    };
                })
            ]), 1040, ["onClose", "onOk", "height"])
        ]),
        _: 2
    }, [
        !_ctx.$slots.title ? {
            name: "title",
            fn: vue.withCtx(() => [
                vue.createVNode(_component_DrawerHeader, {
                    title: _ctx.getMergeProps.title,
                    isDetail: _ctx.isDetail,
                    showDetailBack: _ctx.showDetailBack,
                    onClose: _ctx.onClose
                }, {
                    titleToolbar: vue.withCtx(() => [
                        vue.renderSlot(_ctx.$slots, "titleToolbar")
                    ]),
                    _: 3
                }, 8, ["title", "isDetail", "showDetailBack", "onClose"])
            ]),
            key: "0"
        } : {
            name: "title",
            fn: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "title")
            ]),
            key: "1"
        }
    ]), 1040, ["class", "onClose"]);
}
const BasicDrawer = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$d]]);
const dataTransferRef = vue.reactive({});
const visibleData = vue.reactive({});
function useDrawer() {
    if (!vue.getCurrentInstance()) {
        throw new Error(
            "useDrawer() can only be used inside setup() or functional components!"
        );
    }
    const drawer = vue.ref(null);
    const loaded = vue.ref(false);
    const uid = vue.ref("");
    function register(drawerInstance, uuid) {
        tryOnUnmounted(() => {
            drawer.value = null;
            loaded.value = null;
            dataTransferRef[vue.unref(uid)] = null;
        });
        if (vue.unref(loaded) && drawerInstance === vue.unref(drawer)) {
            return;
        }
        uid.value = uuid;
        drawer.value = drawerInstance;
        loaded.value = true;
        drawerInstance.emitVisible = (visible, uid2) => {
            visibleData[uid2] = visible;
        };
    }
    const getInstance = () => {
        const instance = vue.unref(drawer);
        if (!instance) {
            utils.error("useDrawer instance is undefined!");
        }
        return instance;
    };
    const methods2 = {
        setDrawerProps: (props2) => {
            var _a2;
            (_a2 = getInstance()) == null ? void 0 : _a2.setDrawerProps(props2);
        },
        getVisible: vue.computed(() => {
            return visibleData[~~vue.unref(uid)];
        }),
        openDrawer: (visible = true, data, openOnSet = true) => {
            var _a2;
            (_a2 = getInstance()) == null ? void 0 : _a2.setDrawerProps({
                visible
            });
            if (!data)
                return;
            if (openOnSet) {
                dataTransferRef[vue.unref(uid)] = null;
                dataTransferRef[vue.unref(uid)] = vue.toRaw(data);
                return;
            }
            const equal = isEqual(vue.toRaw(dataTransferRef[vue.unref(uid)]), vue.toRaw(data));
            if (!equal) {
                dataTransferRef[vue.unref(uid)] = vue.toRaw(data);
            }
        },
        closeDrawer: () => {
            var _a2;
            (_a2 = getInstance()) == null ? void 0 : _a2.setDrawerProps({ visible: false });
        }
    };
    return [register, methods2];
}
const useDrawerInner = (callbackFn) => {
    const drawerInstanceRef = vue.ref(null);
    const currentInstance = vue.getCurrentInstance();
    const uidRef = vue.ref("");
    if (!vue.getCurrentInstance()) {
        throw new Error(
            "useDrawerInner() can only be used inside setup() or functional components!"
        );
    }
    const getInstance = () => {
        const instance = vue.unref(drawerInstanceRef);
        if (!instance) {
            utils.error("useDrawerInner instance is undefined!");
            return;
        }
        return instance;
    };
    const register = (modalInstance, uuid) => {
        tryOnUnmounted(() => {
            drawerInstanceRef.value = null;
        });
        uidRef.value = uuid;
        drawerInstanceRef.value = modalInstance;
        currentInstance == null ? void 0 : currentInstance.emit("register", modalInstance, uuid);
    };
    vue.watchEffect(() => {
        const data = dataTransferRef[vue.unref(uidRef)];
        if (!data)
            return;
        if (!callbackFn || !utils.isFunction(callbackFn))
            return;
        vue.nextTick(() => {
            callbackFn(data);
        });
    });
    return [
        register,
        {
            changeLoading: (loading = true) => {
                var _a2;
                (_a2 = getInstance()) == null ? void 0 : _a2.setDrawerProps({ loading });
            },
            changeOkLoading: (loading = true) => {
                var _a2;
                (_a2 = getInstance()) == null ? void 0 : _a2.setDrawerProps({ confirmLoading: loading });
            },
            getVisible: vue.computed(() => {
                return visibleData[~~vue.unref(uidRef)];
            }),
            closeDrawer: () => {
                var _a2;
                (_a2 = getInstance()) == null ? void 0 : _a2.setDrawerProps({ visible: false });
            },
            setDrawerProps: (props2) => {
                var _a2;
                (_a2 = getInstance()) == null ? void 0 : _a2.setDrawerProps(props2);
            }
        }
    ];
};
/*!
 * Cropper.js v1.5.13
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2022-11-20T05:30:46.114Z
 */
function ownKeys(object, enumerableOnly) {
    var keys2 = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys2.push.apply(keys2, symbols);
    }
    return keys2;
}
function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
        });
    }
    return target;
}
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
        return typeof obj2;
    } : function(obj2) {
        return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props2) {
    for (var i = 0; i < props2.length; i++) {
        var descriptor = props2[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
            descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
        _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
        writable: false
    });
    return Constructor;
}
function _defineProperty(obj, key2, value) {
    if (key2 in obj) {
        Object.defineProperty(obj, key2, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key2] = value;
    }
    return obj;
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
        return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
        return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o)
        return;
    if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
        n = o.constructor.name;
    if (n === "Map" || n === "Set")
        return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
        len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
        arr2[i] = arr[i];
    return arr2;
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var IS_BROWSER = typeof window !== "undefined" && typeof window.document !== "undefined";
var WINDOW = IS_BROWSER ? window : {};
var IS_TOUCH_DEVICE = IS_BROWSER && WINDOW.document.documentElement ? "ontouchstart" in WINDOW.document.documentElement : false;
var HAS_POINTER_EVENT = IS_BROWSER ? "PointerEvent" in WINDOW : false;
var NAMESPACE = "cropper";
var ACTION_ALL = "all";
var ACTION_CROP = "crop";
var ACTION_MOVE = "move";
var ACTION_ZOOM = "zoom";
var ACTION_EAST = "e";
var ACTION_WEST = "w";
var ACTION_SOUTH = "s";
var ACTION_NORTH = "n";
var ACTION_NORTH_EAST = "ne";
var ACTION_NORTH_WEST = "nw";
var ACTION_SOUTH_EAST = "se";
var ACTION_SOUTH_WEST = "sw";
var CLASS_CROP = "".concat(NAMESPACE, "-crop");
var CLASS_DISABLED = "".concat(NAMESPACE, "-disabled");
var CLASS_HIDDEN = "".concat(NAMESPACE, "-hidden");
var CLASS_HIDE = "".concat(NAMESPACE, "-hide");
var CLASS_INVISIBLE = "".concat(NAMESPACE, "-invisible");
var CLASS_MODAL = "".concat(NAMESPACE, "-modal");
var CLASS_MOVE = "".concat(NAMESPACE, "-move");
var DATA_ACTION = "".concat(NAMESPACE, "Action");
var DATA_PREVIEW = "".concat(NAMESPACE, "Preview");
var DRAG_MODE_CROP = "crop";
var DRAG_MODE_MOVE = "move";
var DRAG_MODE_NONE = "none";
var EVENT_CROP = "crop";
var EVENT_CROP_END = "cropend";
var EVENT_CROP_MOVE = "cropmove";
var EVENT_CROP_START = "cropstart";
var EVENT_DBLCLICK = "dblclick";
var EVENT_TOUCH_START = IS_TOUCH_DEVICE ? "touchstart" : "mousedown";
var EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? "touchmove" : "mousemove";
var EVENT_TOUCH_END = IS_TOUCH_DEVICE ? "touchend touchcancel" : "mouseup";
var EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? "pointerdown" : EVENT_TOUCH_START;
var EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? "pointermove" : EVENT_TOUCH_MOVE;
var EVENT_POINTER_UP = HAS_POINTER_EVENT ? "pointerup pointercancel" : EVENT_TOUCH_END;
var EVENT_READY = "ready";
var EVENT_RESIZE = "resize";
var EVENT_WHEEL = "wheel";
var EVENT_ZOOM = "zoom";
var MIME_TYPE_JPEG = "image/jpeg";
var REGEXP_ACTIONS = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/;
var REGEXP_DATA_URL = /^data:/;
var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
var REGEXP_TAG_NAME = /^img|canvas$/i;
var MIN_CONTAINER_WIDTH = 200;
var MIN_CONTAINER_HEIGHT = 100;
var DEFAULTS = {
    // Define the view mode of the cropper
    viewMode: 0,
    // 0, 1, 2, 3
    // Define the dragging mode of the cropper
    dragMode: DRAG_MODE_CROP,
    // 'crop', 'move' or 'none'
    // Define the initial aspect ratio of the crop box
    initialAspectRatio: NaN,
    // Define the aspect ratio of the crop box
    aspectRatio: NaN,
    // An object with the previous cropping result data
    data: null,
    // A selector for adding extra containers to preview
    preview: "",
    // Re-render the cropper when resize the window
    responsive: true,
    // Restore the cropped area after resize the window
    restore: true,
    // Check if the current image is a cross-origin image
    checkCrossOrigin: true,
    // Check the current image's Exif Orientation information
    checkOrientation: true,
    // Show the black modal
    modal: true,
    // Show the dashed lines for guiding
    guides: true,
    // Show the center indicator for guiding
    center: true,
    // Show the white modal to highlight the crop box
    highlight: true,
    // Show the grid background
    background: true,
    // Enable to crop the image automatically when initialize
    autoCrop: true,
    // Define the percentage of automatic cropping area when initializes
    autoCropArea: 0.8,
    // Enable to move the image
    movable: true,
    // Enable to rotate the image
    rotatable: true,
    // Enable to scale the image
    scalable: true,
    // Enable to zoom the image
    zoomable: true,
    // Enable to zoom the image by dragging touch
    zoomOnTouch: true,
    // Enable to zoom the image by wheeling mouse
    zoomOnWheel: true,
    // Define zoom ratio when zoom the image by wheeling mouse
    wheelZoomRatio: 0.1,
    // Enable to move the crop box
    cropBoxMovable: true,
    // Enable to resize the crop box
    cropBoxResizable: true,
    // Toggle drag mode between "crop" and "move" when click twice on the cropper
    toggleDragModeOnDblclick: true,
    // Size limitation
    minCanvasWidth: 0,
    minCanvasHeight: 0,
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: MIN_CONTAINER_WIDTH,
    minContainerHeight: MIN_CONTAINER_HEIGHT,
    // Shortcuts of events
    ready: null,
    cropstart: null,
    cropmove: null,
    cropend: null,
    crop: null,
    zoom: null
};
var TEMPLATE = '<div class="cropper-container" touch-action="none"><div class="cropper-wrap-box"><div class="cropper-canvas"></div></div><div class="cropper-drag-box"></div><div class="cropper-crop-box"><span class="cropper-view-box"></span><span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span><span class="cropper-center"></span><span class="cropper-face"></span><span class="cropper-line line-e" data-cropper-action="e"></span><span class="cropper-line line-n" data-cropper-action="n"></span><span class="cropper-line line-w" data-cropper-action="w"></span><span class="cropper-line line-s" data-cropper-action="s"></span><span class="cropper-point point-e" data-cropper-action="e"></span><span class="cropper-point point-n" data-cropper-action="n"></span><span class="cropper-point point-w" data-cropper-action="w"></span><span class="cropper-point point-s" data-cropper-action="s"></span><span class="cropper-point point-ne" data-cropper-action="ne"></span><span class="cropper-point point-nw" data-cropper-action="nw"></span><span class="cropper-point point-sw" data-cropper-action="sw"></span><span class="cropper-point point-se" data-cropper-action="se"></span></div></div>';
var isNaN$1 = Number.isNaN || WINDOW.isNaN;
function isNumber(value) {
    return typeof value === "number" && !isNaN$1(value);
}
var isPositiveNumber = function isPositiveNumber2(value) {
    return value > 0 && value < Infinity;
};
function isUndefined(value) {
    return typeof value === "undefined";
}
function isObject(value) {
    return _typeof(value) === "object" && value !== null;
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isPlainObject(value) {
    if (!isObject(value)) {
        return false;
    }
    try {
        var _constructor = value.constructor;
        var prototype = _constructor.prototype;
        return _constructor && prototype && hasOwnProperty.call(prototype, "isPrototypeOf");
    } catch (error2) {
        return false;
    }
}
function isFunction(value) {
    return typeof value === "function";
}
var slice = Array.prototype.slice;
function toArray(value) {
    return Array.from ? Array.from(value) : slice.call(value);
}
function forEach(data, callback) {
    if (data && isFunction(callback)) {
        if (Array.isArray(data) || isNumber(data.length)) {
            toArray(data).forEach(function(value, key2) {
                callback.call(data, value, key2, data);
            });
        } else if (isObject(data)) {
            Object.keys(data).forEach(function(key2) {
                callback.call(data, data[key2], key2, data);
            });
        }
    }
    return data;
}
var assign = Object.assign || function assign2(target) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }
    if (isObject(target) && args.length > 0) {
        args.forEach(function(arg) {
            if (isObject(arg)) {
                Object.keys(arg).forEach(function(key2) {
                    target[key2] = arg[key2];
                });
            }
        });
    }
    return target;
};
var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/;
function normalizeDecimalNumber(value) {
    var times = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e11;
    return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
}
var REGEXP_SUFFIX = /^width|height|left|top|marginLeft|marginTop$/;
function setStyle(element, styles) {
    var style2 = element.style;
    forEach(styles, function(value, property2) {
        if (REGEXP_SUFFIX.test(property2) && isNumber(value)) {
            value = "".concat(value, "px");
        }
        style2[property2] = value;
    });
}
function hasClass(element, value) {
    return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
}
function addClass(element, value) {
    if (!value) {
        return;
    }
    if (isNumber(element.length)) {
        forEach(element, function(elem) {
            addClass(elem, value);
        });
        return;
    }
    if (element.classList) {
        element.classList.add(value);
        return;
    }
    var className = element.className.trim();
    if (!className) {
        element.className = value;
    } else if (className.indexOf(value) < 0) {
        element.className = "".concat(className, " ").concat(value);
    }
}
function removeClass(element, value) {
    if (!value) {
        return;
    }
    if (isNumber(element.length)) {
        forEach(element, function(elem) {
            removeClass(elem, value);
        });
        return;
    }
    if (element.classList) {
        element.classList.remove(value);
        return;
    }
    if (element.className.indexOf(value) >= 0) {
        element.className = element.className.replace(value, "");
    }
}
function toggleClass(element, value, added) {
    if (!value) {
        return;
    }
    if (isNumber(element.length)) {
        forEach(element, function(elem) {
            toggleClass(elem, value, added);
        });
        return;
    }
    if (added) {
        addClass(element, value);
    } else {
        removeClass(element, value);
    }
}
var REGEXP_CAMEL_CASE = /([a-z\d])([A-Z])/g;
function toParamCase(value) {
    return value.replace(REGEXP_CAMEL_CASE, "$1-$2").toLowerCase();
}
function getData(element, name) {
    if (isObject(element[name])) {
        return element[name];
    }
    if (element.dataset) {
        return element.dataset[name];
    }
    return element.getAttribute("data-".concat(toParamCase(name)));
}
function setData(element, name, data) {
    if (isObject(data)) {
        element[name] = data;
    } else if (element.dataset) {
        element.dataset[name] = data;
    } else {
        element.setAttribute("data-".concat(toParamCase(name)), data);
    }
}
function removeData(element, name) {
    if (isObject(element[name])) {
        try {
            delete element[name];
        } catch (error2) {
            element[name] = void 0;
        }
    } else if (element.dataset) {
        try {
            delete element.dataset[name];
        } catch (error2) {
            element.dataset[name] = void 0;
        }
    } else {
        element.removeAttribute("data-".concat(toParamCase(name)));
    }
}
var REGEXP_SPACES = /\s\s*/;
var onceSupported = function() {
    var supported = false;
    if (IS_BROWSER) {
        var once = false;
        var listener = function listener2() {
        };
        var options = Object.defineProperty({}, "once", {
            get: function get2() {
                supported = true;
                return once;
            },
            /**
             * This setter can fix a `TypeError` in strict mode
             * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
             * @param {boolean} value - The value to set
             */
            set: function set2(value) {
                once = value;
            }
        });
        WINDOW.addEventListener("test", listener, options);
        WINDOW.removeEventListener("test", listener, options);
    }
    return supported;
}();
function removeListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    var handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function(event) {
        if (!onceSupported) {
            var listeners = element.listeners;
            if (listeners && listeners[event] && listeners[event][listener]) {
                handler = listeners[event][listener];
                delete listeners[event][listener];
                if (Object.keys(listeners[event]).length === 0) {
                    delete listeners[event];
                }
                if (Object.keys(listeners).length === 0) {
                    delete element.listeners;
                }
            }
        }
        element.removeEventListener(event, handler, options);
    });
}
function addListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    var _handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function(event) {
        if (options.once && !onceSupported) {
            var _element$listeners = element.listeners, listeners = _element$listeners === void 0 ? {} : _element$listeners;
            _handler = function handler() {
                delete listeners[event][listener];
                element.removeEventListener(event, _handler, options);
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }
                listener.apply(element, args);
            };
            if (!listeners[event]) {
                listeners[event] = {};
            }
            if (listeners[event][listener]) {
                element.removeEventListener(event, listeners[event][listener], options);
            }
            listeners[event][listener] = _handler;
            element.listeners = listeners;
        }
        element.addEventListener(event, _handler, options);
    });
}
function dispatchEvent(element, type, data) {
    var event;
    if (isFunction(Event) && isFunction(CustomEvent)) {
        event = new CustomEvent(type, {
            detail: data,
            bubbles: true,
            cancelable: true
        });
    } else {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(type, true, true, data);
    }
    return element.dispatchEvent(event);
}
function getOffset(element) {
    var box = element.getBoundingClientRect();
    return {
        left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
        top: box.top + (window.pageYOffset - document.documentElement.clientTop)
    };
}
var location = WINDOW.location;
var REGEXP_ORIGINS = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
function isCrossOriginURL(url) {
    var parts = url.match(REGEXP_ORIGINS);
    return parts !== null && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
}
function addTimestamp(url) {
    var timestamp = "timestamp=".concat((/* @__PURE__ */ new Date()).getTime());
    return url + (url.indexOf("?") === -1 ? "?" : "&") + timestamp;
}
function getTransforms(_ref) {
    var rotate2 = _ref.rotate, scaleX2 = _ref.scaleX, scaleY2 = _ref.scaleY, translateX = _ref.translateX, translateY = _ref.translateY;
    var values = [];
    if (isNumber(translateX) && translateX !== 0) {
        values.push("translateX(".concat(translateX, "px)"));
    }
    if (isNumber(translateY) && translateY !== 0) {
        values.push("translateY(".concat(translateY, "px)"));
    }
    if (isNumber(rotate2) && rotate2 !== 0) {
        values.push("rotate(".concat(rotate2, "deg)"));
    }
    if (isNumber(scaleX2) && scaleX2 !== 1) {
        values.push("scaleX(".concat(scaleX2, ")"));
    }
    if (isNumber(scaleY2) && scaleY2 !== 1) {
        values.push("scaleY(".concat(scaleY2, ")"));
    }
    var transform = values.length ? values.join(" ") : "none";
    return {
        WebkitTransform: transform,
        msTransform: transform,
        transform
    };
}
function getMaxZoomRatio(pointers) {
    var pointers2 = _objectSpread2({}, pointers);
    var maxRatio = 0;
    forEach(pointers, function(pointer, pointerId) {
        delete pointers2[pointerId];
        forEach(pointers2, function(pointer2) {
            var x1 = Math.abs(pointer.startX - pointer2.startX);
            var y1 = Math.abs(pointer.startY - pointer2.startY);
            var x2 = Math.abs(pointer.endX - pointer2.endX);
            var y2 = Math.abs(pointer.endY - pointer2.endY);
            var z1 = Math.sqrt(x1 * x1 + y1 * y1);
            var z2 = Math.sqrt(x2 * x2 + y2 * y2);
            var ratio = (z2 - z1) / z1;
            if (Math.abs(ratio) > Math.abs(maxRatio)) {
                maxRatio = ratio;
            }
        });
    });
    return maxRatio;
}
function getPointer(_ref2, endOnly) {
    var pageX = _ref2.pageX, pageY = _ref2.pageY;
    var end = {
        endX: pageX,
        endY: pageY
    };
    return endOnly ? end : _objectSpread2({
        startX: pageX,
        startY: pageY
    }, end);
}
function getPointersCenter(pointers) {
    var pageX = 0;
    var pageY = 0;
    var count = 0;
    forEach(pointers, function(_ref3) {
        var startX = _ref3.startX, startY = _ref3.startY;
        pageX += startX;
        pageY += startY;
        count += 1;
    });
    pageX /= count;
    pageY /= count;
    return {
        pageX,
        pageY
    };
}
function getAdjustedSizes(_ref4) {
    var aspectRatio = _ref4.aspectRatio, height = _ref4.height, width = _ref4.width;
    var type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "contain";
    var isValidWidth = isPositiveNumber(width);
    var isValidHeight = isPositiveNumber(height);
    if (isValidWidth && isValidHeight) {
        var adjustedWidth = height * aspectRatio;
        if (type === "contain" && adjustedWidth > width || type === "cover" && adjustedWidth < width) {
            height = width / aspectRatio;
        } else {
            width = height * aspectRatio;
        }
    } else if (isValidWidth) {
        height = width / aspectRatio;
    } else if (isValidHeight) {
        width = height * aspectRatio;
    }
    return {
        width,
        height
    };
}
function getRotatedSizes(_ref5) {
    var width = _ref5.width, height = _ref5.height, degree = _ref5.degree;
    degree = Math.abs(degree) % 180;
    if (degree === 90) {
        return {
            width: height,
            height: width
        };
    }
    var arc = degree % 90 * Math.PI / 180;
    var sinArc = Math.sin(arc);
    var cosArc = Math.cos(arc);
    var newWidth = width * cosArc + height * sinArc;
    var newHeight = width * sinArc + height * cosArc;
    return degree > 90 ? {
        width: newHeight,
        height: newWidth
    } : {
        width: newWidth,
        height: newHeight
    };
}
function getSourceCanvas(image, _ref6, _ref7, _ref8) {
    var imageAspectRatio = _ref6.aspectRatio, imageNaturalWidth = _ref6.naturalWidth, imageNaturalHeight = _ref6.naturalHeight, _ref6$rotate = _ref6.rotate, rotate2 = _ref6$rotate === void 0 ? 0 : _ref6$rotate, _ref6$scaleX = _ref6.scaleX, scaleX2 = _ref6$scaleX === void 0 ? 1 : _ref6$scaleX, _ref6$scaleY = _ref6.scaleY, scaleY2 = _ref6$scaleY === void 0 ? 1 : _ref6$scaleY;
    var aspectRatio = _ref7.aspectRatio, naturalWidth = _ref7.naturalWidth, naturalHeight = _ref7.naturalHeight;
    var _ref8$fillColor = _ref8.fillColor, fillColor = _ref8$fillColor === void 0 ? "transparent" : _ref8$fillColor, _ref8$imageSmoothingE = _ref8.imageSmoothingEnabled, imageSmoothingEnabled = _ref8$imageSmoothingE === void 0 ? true : _ref8$imageSmoothingE, _ref8$imageSmoothingQ = _ref8.imageSmoothingQuality, imageSmoothingQuality = _ref8$imageSmoothingQ === void 0 ? "low" : _ref8$imageSmoothingQ, _ref8$maxWidth = _ref8.maxWidth, maxWidth = _ref8$maxWidth === void 0 ? Infinity : _ref8$maxWidth, _ref8$maxHeight = _ref8.maxHeight, maxHeight = _ref8$maxHeight === void 0 ? Infinity : _ref8$maxHeight, _ref8$minWidth = _ref8.minWidth, minWidth = _ref8$minWidth === void 0 ? 0 : _ref8$minWidth, _ref8$minHeight = _ref8.minHeight, minHeight = _ref8$minHeight === void 0 ? 0 : _ref8$minHeight;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var maxSizes = getAdjustedSizes({
        aspectRatio,
        width: maxWidth,
        height: maxHeight
    });
    var minSizes = getAdjustedSizes({
        aspectRatio,
        width: minWidth,
        height: minHeight
    }, "cover");
    var width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
    var height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight));
    var destMaxSizes = getAdjustedSizes({
        aspectRatio: imageAspectRatio,
        width: maxWidth,
        height: maxHeight
    });
    var destMinSizes = getAdjustedSizes({
        aspectRatio: imageAspectRatio,
        width: minWidth,
        height: minHeight
    }, "cover");
    var destWidth = Math.min(destMaxSizes.width, Math.max(destMinSizes.width, imageNaturalWidth));
    var destHeight = Math.min(destMaxSizes.height, Math.max(destMinSizes.height, imageNaturalHeight));
    var params = [-destWidth / 2, -destHeight / 2, destWidth, destHeight];
    canvas.width = normalizeDecimalNumber(width);
    canvas.height = normalizeDecimalNumber(height);
    context.fillStyle = fillColor;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(rotate2 * Math.PI / 180);
    context.scale(scaleX2, scaleY2);
    context.imageSmoothingEnabled = imageSmoothingEnabled;
    context.imageSmoothingQuality = imageSmoothingQuality;
    context.drawImage.apply(context, [image].concat(_toConsumableArray(params.map(function(param) {
        return Math.floor(normalizeDecimalNumber(param));
    }))));
    context.restore();
    return canvas;
}
var fromCharCode = String.fromCharCode;
function getStringFromCharCode(dataView, start, length) {
    var str = "";
    length += start;
    for (var i = start; i < length; i += 1) {
        str += fromCharCode(dataView.getUint8(i));
    }
    return str;
}
var REGEXP_DATA_URL_HEAD = /^data:.*,/;
function dataURLToArrayBuffer(dataURL) {
    var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, "");
    var binary = atob(base64);
    var arrayBuffer = new ArrayBuffer(binary.length);
    var uint8 = new Uint8Array(arrayBuffer);
    forEach(uint8, function(value, i) {
        uint8[i] = binary.charCodeAt(i);
    });
    return arrayBuffer;
}
function arrayBufferToDataURL(arrayBuffer, mimeType) {
    var chunks = [];
    var chunkSize = 8192;
    var uint8 = new Uint8Array(arrayBuffer);
    while (uint8.length > 0) {
        chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
        uint8 = uint8.subarray(chunkSize);
    }
    return "data:".concat(mimeType, ";base64,").concat(btoa(chunks.join("")));
}
function resetAndGetOrientation(arrayBuffer) {
    var dataView = new DataView(arrayBuffer);
    var orientation;
    try {
        var littleEndian;
        var app1Start;
        var ifdStart;
        if (dataView.getUint8(0) === 255 && dataView.getUint8(1) === 216) {
            var length = dataView.byteLength;
            var offset = 2;
            while (offset + 1 < length) {
                if (dataView.getUint8(offset) === 255 && dataView.getUint8(offset + 1) === 225) {
                    app1Start = offset;
                    break;
                }
                offset += 1;
            }
        }
        if (app1Start) {
            var exifIDCode = app1Start + 4;
            var tiffOffset = app1Start + 10;
            if (getStringFromCharCode(dataView, exifIDCode, 4) === "Exif") {
                var endianness = dataView.getUint16(tiffOffset);
                littleEndian = endianness === 18761;
                if (littleEndian || endianness === 19789) {
                    if (dataView.getUint16(tiffOffset + 2, littleEndian) === 42) {
                        var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
                        if (firstIFDOffset >= 8) {
                            ifdStart = tiffOffset + firstIFDOffset;
                        }
                    }
                }
            }
        }
        if (ifdStart) {
            var _length = dataView.getUint16(ifdStart, littleEndian);
            var _offset;
            var i;
            for (i = 0; i < _length; i += 1) {
                _offset = ifdStart + i * 12 + 2;
                if (dataView.getUint16(_offset, littleEndian) === 274) {
                    _offset += 8;
                    orientation = dataView.getUint16(_offset, littleEndian);
                    dataView.setUint16(_offset, 1, littleEndian);
                    break;
                }
            }
        }
    } catch (error2) {
        orientation = 1;
    }
    return orientation;
}
function parseOrientation(orientation) {
    var rotate2 = 0;
    var scaleX2 = 1;
    var scaleY2 = 1;
    switch (orientation) {
        case 2:
            scaleX2 = -1;
            break;
        case 3:
            rotate2 = -180;
            break;
        case 4:
            scaleY2 = -1;
            break;
        case 5:
            rotate2 = 90;
            scaleY2 = -1;
            break;
        case 6:
            rotate2 = 90;
            break;
        case 7:
            rotate2 = 90;
            scaleX2 = -1;
            break;
        case 8:
            rotate2 = -90;
            break;
    }
    return {
        rotate: rotate2,
        scaleX: scaleX2,
        scaleY: scaleY2
    };
}
var render2 = {
    render: function render3() {
        this.initContainer();
        this.initCanvas();
        this.initCropBox();
        this.renderCanvas();
        if (this.cropped) {
            this.renderCropBox();
        }
    },
    initContainer: function initContainer() {
        var element = this.element, options = this.options, container = this.container, cropper2 = this.cropper;
        var minWidth = Number(options.minContainerWidth);
        var minHeight = Number(options.minContainerHeight);
        addClass(cropper2, CLASS_HIDDEN);
        removeClass(element, CLASS_HIDDEN);
        var containerData = {
            width: Math.max(container.offsetWidth, minWidth >= 0 ? minWidth : MIN_CONTAINER_WIDTH),
            height: Math.max(container.offsetHeight, minHeight >= 0 ? minHeight : MIN_CONTAINER_HEIGHT)
        };
        this.containerData = containerData;
        setStyle(cropper2, {
            width: containerData.width,
            height: containerData.height
        });
        addClass(element, CLASS_HIDDEN);
        removeClass(cropper2, CLASS_HIDDEN);
    },
    // Canvas (image wrapper)
    initCanvas: function initCanvas() {
        var containerData = this.containerData, imageData = this.imageData;
        var viewMode = this.options.viewMode;
        var rotated = Math.abs(imageData.rotate) % 180 === 90;
        var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
        var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
        var aspectRatio = naturalWidth / naturalHeight;
        var canvasWidth = containerData.width;
        var canvasHeight = containerData.height;
        if (containerData.height * aspectRatio > containerData.width) {
            if (viewMode === 3) {
                canvasWidth = containerData.height * aspectRatio;
            } else {
                canvasHeight = containerData.width / aspectRatio;
            }
        } else if (viewMode === 3) {
            canvasHeight = containerData.width / aspectRatio;
        } else {
            canvasWidth = containerData.height * aspectRatio;
        }
        var canvasData = {
            aspectRatio,
            naturalWidth,
            naturalHeight,
            width: canvasWidth,
            height: canvasHeight
        };
        this.canvasData = canvasData;
        this.limited = viewMode === 1 || viewMode === 2;
        this.limitCanvas(true, true);
        canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
        canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
        canvasData.left = (containerData.width - canvasData.width) / 2;
        canvasData.top = (containerData.height - canvasData.height) / 2;
        canvasData.oldLeft = canvasData.left;
        canvasData.oldTop = canvasData.top;
        this.initialCanvasData = assign({}, canvasData);
    },
    limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
        var options = this.options, containerData = this.containerData, canvasData = this.canvasData, cropBoxData = this.cropBoxData;
        var viewMode = options.viewMode;
        var aspectRatio = canvasData.aspectRatio;
        var cropped = this.cropped && cropBoxData;
        if (sizeLimited) {
            var minCanvasWidth = Number(options.minCanvasWidth) || 0;
            var minCanvasHeight = Number(options.minCanvasHeight) || 0;
            if (viewMode > 1) {
                minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
                minCanvasHeight = Math.max(minCanvasHeight, containerData.height);
                if (viewMode === 3) {
                    if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                        minCanvasWidth = minCanvasHeight * aspectRatio;
                    } else {
                        minCanvasHeight = minCanvasWidth / aspectRatio;
                    }
                }
            } else if (viewMode > 0) {
                if (minCanvasWidth) {
                    minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
                } else if (minCanvasHeight) {
                    minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
                } else if (cropped) {
                    minCanvasWidth = cropBoxData.width;
                    minCanvasHeight = cropBoxData.height;
                    if (minCanvasHeight * aspectRatio > minCanvasWidth) {
                        minCanvasWidth = minCanvasHeight * aspectRatio;
                    } else {
                        minCanvasHeight = minCanvasWidth / aspectRatio;
                    }
                }
            }
            var _getAdjustedSizes = getAdjustedSizes({
                aspectRatio,
                width: minCanvasWidth,
                height: minCanvasHeight
            });
            minCanvasWidth = _getAdjustedSizes.width;
            minCanvasHeight = _getAdjustedSizes.height;
            canvasData.minWidth = minCanvasWidth;
            canvasData.minHeight = minCanvasHeight;
            canvasData.maxWidth = Infinity;
            canvasData.maxHeight = Infinity;
        }
        if (positionLimited) {
            if (viewMode > (cropped ? 0 : 1)) {
                var newCanvasLeft = containerData.width - canvasData.width;
                var newCanvasTop = containerData.height - canvasData.height;
                canvasData.minLeft = Math.min(0, newCanvasLeft);
                canvasData.minTop = Math.min(0, newCanvasTop);
                canvasData.maxLeft = Math.max(0, newCanvasLeft);
                canvasData.maxTop = Math.max(0, newCanvasTop);
                if (cropped && this.limited) {
                    canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
                    canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
                    canvasData.maxLeft = cropBoxData.left;
                    canvasData.maxTop = cropBoxData.top;
                    if (viewMode === 2) {
                        if (canvasData.width >= containerData.width) {
                            canvasData.minLeft = Math.min(0, newCanvasLeft);
                            canvasData.maxLeft = Math.max(0, newCanvasLeft);
                        }
                        if (canvasData.height >= containerData.height) {
                            canvasData.minTop = Math.min(0, newCanvasTop);
                            canvasData.maxTop = Math.max(0, newCanvasTop);
                        }
                    }
                }
            } else {
                canvasData.minLeft = -canvasData.width;
                canvasData.minTop = -canvasData.height;
                canvasData.maxLeft = containerData.width;
                canvasData.maxTop = containerData.height;
            }
        }
    },
    renderCanvas: function renderCanvas(changed, transformed) {
        var canvasData = this.canvasData, imageData = this.imageData;
        if (transformed) {
            var _getRotatedSizes = getRotatedSizes({
                width: imageData.naturalWidth * Math.abs(imageData.scaleX || 1),
                height: imageData.naturalHeight * Math.abs(imageData.scaleY || 1),
                degree: imageData.rotate || 0
            }), naturalWidth = _getRotatedSizes.width, naturalHeight = _getRotatedSizes.height;
            var width = canvasData.width * (naturalWidth / canvasData.naturalWidth);
            var height = canvasData.height * (naturalHeight / canvasData.naturalHeight);
            canvasData.left -= (width - canvasData.width) / 2;
            canvasData.top -= (height - canvasData.height) / 2;
            canvasData.width = width;
            canvasData.height = height;
            canvasData.aspectRatio = naturalWidth / naturalHeight;
            canvasData.naturalWidth = naturalWidth;
            canvasData.naturalHeight = naturalHeight;
            this.limitCanvas(true, false);
        }
        if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
            canvasData.left = canvasData.oldLeft;
        }
        if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
            canvasData.top = canvasData.oldTop;
        }
        canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
        canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
        this.limitCanvas(false, true);
        canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
        canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
        canvasData.oldLeft = canvasData.left;
        canvasData.oldTop = canvasData.top;
        setStyle(this.canvas, assign({
            width: canvasData.width,
            height: canvasData.height
        }, getTransforms({
            translateX: canvasData.left,
            translateY: canvasData.top
        })));
        this.renderImage(changed);
        if (this.cropped && this.limited) {
            this.limitCropBox(true, true);
        }
    },
    renderImage: function renderImage(changed) {
        var canvasData = this.canvasData, imageData = this.imageData;
        var width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
        var height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);
        assign(imageData, {
            width,
            height,
            left: (canvasData.width - width) / 2,
            top: (canvasData.height - height) / 2
        });
        setStyle(this.image, assign({
            width: imageData.width,
            height: imageData.height
        }, getTransforms(assign({
            translateX: imageData.left,
            translateY: imageData.top
        }, imageData))));
        if (changed) {
            this.output();
        }
    },
    initCropBox: function initCropBox() {
        var options = this.options, canvasData = this.canvasData;
        var aspectRatio = options.aspectRatio || options.initialAspectRatio;
        var autoCropArea = Number(options.autoCropArea) || 0.8;
        var cropBoxData = {
            width: canvasData.width,
            height: canvasData.height
        };
        if (aspectRatio) {
            if (canvasData.height * aspectRatio > canvasData.width) {
                cropBoxData.height = cropBoxData.width / aspectRatio;
            } else {
                cropBoxData.width = cropBoxData.height * aspectRatio;
            }
        }
        this.cropBoxData = cropBoxData;
        this.limitCropBox(true, true);
        cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
        cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
        cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
        cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
        cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
        cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
        cropBoxData.oldLeft = cropBoxData.left;
        cropBoxData.oldTop = cropBoxData.top;
        this.initialCropBoxData = assign({}, cropBoxData);
    },
    limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
        var options = this.options, containerData = this.containerData, canvasData = this.canvasData, cropBoxData = this.cropBoxData, limited = this.limited;
        var aspectRatio = options.aspectRatio;
        if (sizeLimited) {
            var minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
            var minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
            var maxCropBoxWidth = limited ? Math.min(containerData.width, canvasData.width, canvasData.width + canvasData.left, containerData.width - canvasData.left) : containerData.width;
            var maxCropBoxHeight = limited ? Math.min(containerData.height, canvasData.height, canvasData.height + canvasData.top, containerData.height - canvasData.top) : containerData.height;
            minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
            minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);
            if (aspectRatio) {
                if (minCropBoxWidth && minCropBoxHeight) {
                    if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
                        minCropBoxHeight = minCropBoxWidth / aspectRatio;
                    } else {
                        minCropBoxWidth = minCropBoxHeight * aspectRatio;
                    }
                } else if (minCropBoxWidth) {
                    minCropBoxHeight = minCropBoxWidth / aspectRatio;
                } else if (minCropBoxHeight) {
                    minCropBoxWidth = minCropBoxHeight * aspectRatio;
                }
                if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
                    maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
                } else {
                    maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
                }
            }
            cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
            cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
            cropBoxData.maxWidth = maxCropBoxWidth;
            cropBoxData.maxHeight = maxCropBoxHeight;
        }
        if (positionLimited) {
            if (limited) {
                cropBoxData.minLeft = Math.max(0, canvasData.left);
                cropBoxData.minTop = Math.max(0, canvasData.top);
                cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
                cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
            } else {
                cropBoxData.minLeft = 0;
                cropBoxData.minTop = 0;
                cropBoxData.maxLeft = containerData.width - cropBoxData.width;
                cropBoxData.maxTop = containerData.height - cropBoxData.height;
            }
        }
    },
    renderCropBox: function renderCropBox() {
        var options = this.options, containerData = this.containerData, cropBoxData = this.cropBoxData;
        if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
            cropBoxData.left = cropBoxData.oldLeft;
        }
        if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
            cropBoxData.top = cropBoxData.oldTop;
        }
        cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
        cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
        this.limitCropBox(false, true);
        cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
        cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
        cropBoxData.oldLeft = cropBoxData.left;
        cropBoxData.oldTop = cropBoxData.top;
        if (options.movable && options.cropBoxMovable) {
            setData(this.face, DATA_ACTION, cropBoxData.width >= containerData.width && cropBoxData.height >= containerData.height ? ACTION_MOVE : ACTION_ALL);
        }
        setStyle(this.cropBox, assign({
            width: cropBoxData.width,
            height: cropBoxData.height
        }, getTransforms({
            translateX: cropBoxData.left,
            translateY: cropBoxData.top
        })));
        if (this.cropped && this.limited) {
            this.limitCanvas(true, true);
        }
        if (!this.disabled) {
            this.output();
        }
    },
    output: function output() {
        this.preview();
        dispatchEvent(this.element, EVENT_CROP, this.getData());
    }
};
var preview = {
    initPreview: function initPreview() {
        var element = this.element, crossOrigin = this.crossOrigin;
        var preview3 = this.options.preview;
        var url = crossOrigin ? this.crossOriginUrl : this.url;
        var alt = element.alt || "The image to preview";
        var image = document.createElement("img");
        if (crossOrigin) {
            image.crossOrigin = crossOrigin;
        }
        image.src = url;
        image.alt = alt;
        this.viewBox.appendChild(image);
        this.viewBoxImage = image;
        if (!preview3) {
            return;
        }
        var previews = preview3;
        if (typeof preview3 === "string") {
            previews = element.ownerDocument.querySelectorAll(preview3);
        } else if (preview3.querySelector) {
            previews = [preview3];
        }
        this.previews = previews;
        forEach(previews, function(el) {
            var img = document.createElement("img");
            setData(el, DATA_PREVIEW, {
                width: el.offsetWidth,
                height: el.offsetHeight,
                html: el.innerHTML
            });
            if (crossOrigin) {
                img.crossOrigin = crossOrigin;
            }
            img.src = url;
            img.alt = alt;
            img.style.cssText = 'display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;"';
            el.innerHTML = "";
            el.appendChild(img);
        });
    },
    resetPreview: function resetPreview() {
        forEach(this.previews, function(element) {
            var data = getData(element, DATA_PREVIEW);
            setStyle(element, {
                width: data.width,
                height: data.height
            });
            element.innerHTML = data.html;
            removeData(element, DATA_PREVIEW);
        });
    },
    preview: function preview2() {
        var imageData = this.imageData, canvasData = this.canvasData, cropBoxData = this.cropBoxData;
        var cropBoxWidth = cropBoxData.width, cropBoxHeight = cropBoxData.height;
        var width = imageData.width, height = imageData.height;
        var left = cropBoxData.left - canvasData.left - imageData.left;
        var top = cropBoxData.top - canvasData.top - imageData.top;
        if (!this.cropped || this.disabled) {
            return;
        }
        setStyle(this.viewBoxImage, assign({
            width,
            height
        }, getTransforms(assign({
            translateX: -left,
            translateY: -top
        }, imageData))));
        forEach(this.previews, function(element) {
            var data = getData(element, DATA_PREVIEW);
            var originalWidth = data.width;
            var originalHeight = data.height;
            var newWidth = originalWidth;
            var newHeight = originalHeight;
            var ratio = 1;
            if (cropBoxWidth) {
                ratio = originalWidth / cropBoxWidth;
                newHeight = cropBoxHeight * ratio;
            }
            if (cropBoxHeight && newHeight > originalHeight) {
                ratio = originalHeight / cropBoxHeight;
                newWidth = cropBoxWidth * ratio;
                newHeight = originalHeight;
            }
            setStyle(element, {
                width: newWidth,
                height: newHeight
            });
            setStyle(element.getElementsByTagName("img")[0], assign({
                width: width * ratio,
                height: height * ratio
            }, getTransforms(assign({
                translateX: -left * ratio,
                translateY: -top * ratio
            }, imageData))));
        });
    }
};
var events = {
    bind: function bind() {
        var element = this.element, options = this.options, cropper2 = this.cropper;
        if (isFunction(options.cropstart)) {
            addListener(element, EVENT_CROP_START, options.cropstart);
        }
        if (isFunction(options.cropmove)) {
            addListener(element, EVENT_CROP_MOVE, options.cropmove);
        }
        if (isFunction(options.cropend)) {
            addListener(element, EVENT_CROP_END, options.cropend);
        }
        if (isFunction(options.crop)) {
            addListener(element, EVENT_CROP, options.crop);
        }
        if (isFunction(options.zoom)) {
            addListener(element, EVENT_ZOOM, options.zoom);
        }
        addListener(cropper2, EVENT_POINTER_DOWN, this.onCropStart = this.cropStart.bind(this));
        if (options.zoomable && options.zoomOnWheel) {
            addListener(cropper2, EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
                passive: false,
                capture: true
            });
        }
        if (options.toggleDragModeOnDblclick) {
            addListener(cropper2, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
        }
        addListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove = this.cropMove.bind(this));
        addListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd = this.cropEnd.bind(this));
        if (options.responsive) {
            addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));
        }
    },
    unbind: function unbind() {
        var element = this.element, options = this.options, cropper2 = this.cropper;
        if (isFunction(options.cropstart)) {
            removeListener(element, EVENT_CROP_START, options.cropstart);
        }
        if (isFunction(options.cropmove)) {
            removeListener(element, EVENT_CROP_MOVE, options.cropmove);
        }
        if (isFunction(options.cropend)) {
            removeListener(element, EVENT_CROP_END, options.cropend);
        }
        if (isFunction(options.crop)) {
            removeListener(element, EVENT_CROP, options.crop);
        }
        if (isFunction(options.zoom)) {
            removeListener(element, EVENT_ZOOM, options.zoom);
        }
        removeListener(cropper2, EVENT_POINTER_DOWN, this.onCropStart);
        if (options.zoomable && options.zoomOnWheel) {
            removeListener(cropper2, EVENT_WHEEL, this.onWheel, {
                passive: false,
                capture: true
            });
        }
        if (options.toggleDragModeOnDblclick) {
            removeListener(cropper2, EVENT_DBLCLICK, this.onDblclick);
        }
        removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove);
        removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd);
        if (options.responsive) {
            removeListener(window, EVENT_RESIZE, this.onResize);
        }
    }
};
var handlers = {
    resize: function resize() {
        if (this.disabled) {
            return;
        }
        var options = this.options, container = this.container, containerData = this.containerData;
        var ratioX = container.offsetWidth / containerData.width;
        var ratioY = container.offsetHeight / containerData.height;
        var ratio = Math.abs(ratioX - 1) > Math.abs(ratioY - 1) ? ratioX : ratioY;
        if (ratio !== 1) {
            var canvasData;
            var cropBoxData;
            if (options.restore) {
                canvasData = this.getCanvasData();
                cropBoxData = this.getCropBoxData();
            }
            this.render();
            if (options.restore) {
                this.setCanvasData(forEach(canvasData, function(n, i) {
                    canvasData[i] = n * ratio;
                }));
                this.setCropBoxData(forEach(cropBoxData, function(n, i) {
                    cropBoxData[i] = n * ratio;
                }));
            }
        }
    },
    dblclick: function dblclick() {
        if (this.disabled || this.options.dragMode === DRAG_MODE_NONE) {
            return;
        }
        this.setDragMode(hasClass(this.dragBox, CLASS_CROP) ? DRAG_MODE_MOVE : DRAG_MODE_CROP);
    },
    wheel: function wheel(event) {
        var _this = this;
        var ratio = Number(this.options.wheelZoomRatio) || 0.1;
        var delta = 1;
        if (this.disabled) {
            return;
        }
        event.preventDefault();
        if (this.wheeling) {
            return;
        }
        this.wheeling = true;
        setTimeout(function() {
            _this.wheeling = false;
        }, 50);
        if (event.deltaY) {
            delta = event.deltaY > 0 ? 1 : -1;
        } else if (event.wheelDelta) {
            delta = -event.wheelDelta / 120;
        } else if (event.detail) {
            delta = event.detail > 0 ? 1 : -1;
        }
        this.zoom(-delta * ratio, event);
    },
    cropStart: function cropStart(event) {
        var buttons = event.buttons, button = event.button;
        if (this.disabled || (event.type === "mousedown" || event.type === "pointerdown" && event.pointerType === "mouse") && // No primary button (Usually the left button)
            (isNumber(buttons) && buttons !== 1 || isNumber(button) && button !== 0 || event.ctrlKey)) {
            return;
        }
        var options = this.options, pointers = this.pointers;
        var action;
        if (event.changedTouches) {
            forEach(event.changedTouches, function(touch) {
                pointers[touch.identifier] = getPointer(touch);
            });
        } else {
            pointers[event.pointerId || 0] = getPointer(event);
        }
        if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
            action = ACTION_ZOOM;
        } else {
            action = getData(event.target, DATA_ACTION);
        }
        if (!REGEXP_ACTIONS.test(action)) {
            return;
        }
        if (dispatchEvent(this.element, EVENT_CROP_START, {
            originalEvent: event,
            action
        }) === false) {
            return;
        }
        event.preventDefault();
        this.action = action;
        this.cropping = false;
        if (action === ACTION_CROP) {
            this.cropping = true;
            addClass(this.dragBox, CLASS_MODAL);
        }
    },
    cropMove: function cropMove(event) {
        var action = this.action;
        if (this.disabled || !action) {
            return;
        }
        var pointers = this.pointers;
        event.preventDefault();
        if (dispatchEvent(this.element, EVENT_CROP_MOVE, {
            originalEvent: event,
            action
        }) === false) {
            return;
        }
        if (event.changedTouches) {
            forEach(event.changedTouches, function(touch) {
                assign(pointers[touch.identifier] || {}, getPointer(touch, true));
            });
        } else {
            assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
        }
        this.change(event);
    },
    cropEnd: function cropEnd(event) {
        if (this.disabled) {
            return;
        }
        var action = this.action, pointers = this.pointers;
        if (event.changedTouches) {
            forEach(event.changedTouches, function(touch) {
                delete pointers[touch.identifier];
            });
        } else {
            delete pointers[event.pointerId || 0];
        }
        if (!action) {
            return;
        }
        event.preventDefault();
        if (!Object.keys(pointers).length) {
            this.action = "";
        }
        if (this.cropping) {
            this.cropping = false;
            toggleClass(this.dragBox, CLASS_MODAL, this.cropped && this.options.modal);
        }
        dispatchEvent(this.element, EVENT_CROP_END, {
            originalEvent: event,
            action
        });
    }
};
var change = {
    change: function change2(event) {
        var options = this.options, canvasData = this.canvasData, containerData = this.containerData, cropBoxData = this.cropBoxData, pointers = this.pointers;
        var action = this.action;
        var aspectRatio = options.aspectRatio;
        var left = cropBoxData.left, top = cropBoxData.top, width = cropBoxData.width, height = cropBoxData.height;
        var right = left + width;
        var bottom = top + height;
        var minLeft = 0;
        var minTop = 0;
        var maxWidth = containerData.width;
        var maxHeight = containerData.height;
        var renderable = true;
        var offset;
        if (!aspectRatio && event.shiftKey) {
            aspectRatio = width && height ? width / height : 1;
        }
        if (this.limited) {
            minLeft = cropBoxData.minLeft;
            minTop = cropBoxData.minTop;
            maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
            maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
        }
        var pointer = pointers[Object.keys(pointers)[0]];
        var range = {
            x: pointer.endX - pointer.startX,
            y: pointer.endY - pointer.startY
        };
        var check = function check2(side) {
            switch (side) {
                case ACTION_EAST:
                    if (right + range.x > maxWidth) {
                        range.x = maxWidth - right;
                    }
                    break;
                case ACTION_WEST:
                    if (left + range.x < minLeft) {
                        range.x = minLeft - left;
                    }
                    break;
                case ACTION_NORTH:
                    if (top + range.y < minTop) {
                        range.y = minTop - top;
                    }
                    break;
                case ACTION_SOUTH:
                    if (bottom + range.y > maxHeight) {
                        range.y = maxHeight - bottom;
                    }
                    break;
            }
        };
        switch (action) {
            case ACTION_ALL:
                left += range.x;
                top += range.y;
                break;
            case ACTION_EAST:
                if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
                    renderable = false;
                    break;
                }
                check(ACTION_EAST);
                width += range.x;
                if (width < 0) {
                    action = ACTION_WEST;
                    width = -width;
                    left -= width;
                }
                if (aspectRatio) {
                    height = width / aspectRatio;
                    top += (cropBoxData.height - height) / 2;
                }
                break;
            case ACTION_NORTH:
                if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
                    renderable = false;
                    break;
                }
                check(ACTION_NORTH);
                height -= range.y;
                top += range.y;
                if (height < 0) {
                    action = ACTION_SOUTH;
                    height = -height;
                    top -= height;
                }
                if (aspectRatio) {
                    width = height * aspectRatio;
                    left += (cropBoxData.width - width) / 2;
                }
                break;
            case ACTION_WEST:
                if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
                    renderable = false;
                    break;
                }
                check(ACTION_WEST);
                width -= range.x;
                left += range.x;
                if (width < 0) {
                    action = ACTION_EAST;
                    width = -width;
                    left -= width;
                }
                if (aspectRatio) {
                    height = width / aspectRatio;
                    top += (cropBoxData.height - height) / 2;
                }
                break;
            case ACTION_SOUTH:
                if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
                    renderable = false;
                    break;
                }
                check(ACTION_SOUTH);
                height += range.y;
                if (height < 0) {
                    action = ACTION_NORTH;
                    height = -height;
                    top -= height;
                }
                if (aspectRatio) {
                    width = height * aspectRatio;
                    left += (cropBoxData.width - width) / 2;
                }
                break;
            case ACTION_NORTH_EAST:
                if (aspectRatio) {
                    if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
                        renderable = false;
                        break;
                    }
                    check(ACTION_NORTH);
                    height -= range.y;
                    top += range.y;
                    width = height * aspectRatio;
                } else {
                    check(ACTION_NORTH);
                    check(ACTION_EAST);
                    if (range.x >= 0) {
                        if (right < maxWidth) {
                            width += range.x;
                        } else if (range.y <= 0 && top <= minTop) {
                            renderable = false;
                        }
                    } else {
                        width += range.x;
                    }
                    if (range.y <= 0) {
                        if (top > minTop) {
                            height -= range.y;
                            top += range.y;
                        }
                    } else {
                        height -= range.y;
                        top += range.y;
                    }
                }
                if (width < 0 && height < 0) {
                    action = ACTION_SOUTH_WEST;
                    height = -height;
                    width = -width;
                    top -= height;
                    left -= width;
                } else if (width < 0) {
                    action = ACTION_NORTH_WEST;
                    width = -width;
                    left -= width;
                } else if (height < 0) {
                    action = ACTION_SOUTH_EAST;
                    height = -height;
                    top -= height;
                }
                break;
            case ACTION_NORTH_WEST:
                if (aspectRatio) {
                    if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
                        renderable = false;
                        break;
                    }
                    check(ACTION_NORTH);
                    height -= range.y;
                    top += range.y;
                    width = height * aspectRatio;
                    left += cropBoxData.width - width;
                } else {
                    check(ACTION_NORTH);
                    check(ACTION_WEST);
                    if (range.x <= 0) {
                        if (left > minLeft) {
                            width -= range.x;
                            left += range.x;
                        } else if (range.y <= 0 && top <= minTop) {
                            renderable = false;
                        }
                    } else {
                        width -= range.x;
                        left += range.x;
                    }
                    if (range.y <= 0) {
                        if (top > minTop) {
                            height -= range.y;
                            top += range.y;
                        }
                    } else {
                        height -= range.y;
                        top += range.y;
                    }
                }
                if (width < 0 && height < 0) {
                    action = ACTION_SOUTH_EAST;
                    height = -height;
                    width = -width;
                    top -= height;
                    left -= width;
                } else if (width < 0) {
                    action = ACTION_NORTH_EAST;
                    width = -width;
                    left -= width;
                } else if (height < 0) {
                    action = ACTION_SOUTH_WEST;
                    height = -height;
                    top -= height;
                }
                break;
            case ACTION_SOUTH_WEST:
                if (aspectRatio) {
                    if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
                        renderable = false;
                        break;
                    }
                    check(ACTION_WEST);
                    width -= range.x;
                    left += range.x;
                    height = width / aspectRatio;
                } else {
                    check(ACTION_SOUTH);
                    check(ACTION_WEST);
                    if (range.x <= 0) {
                        if (left > minLeft) {
                            width -= range.x;
                            left += range.x;
                        } else if (range.y >= 0 && bottom >= maxHeight) {
                            renderable = false;
                        }
                    } else {
                        width -= range.x;
                        left += range.x;
                    }
                    if (range.y >= 0) {
                        if (bottom < maxHeight) {
                            height += range.y;
                        }
                    } else {
                        height += range.y;
                    }
                }
                if (width < 0 && height < 0) {
                    action = ACTION_NORTH_EAST;
                    height = -height;
                    width = -width;
                    top -= height;
                    left -= width;
                } else if (width < 0) {
                    action = ACTION_SOUTH_EAST;
                    width = -width;
                    left -= width;
                } else if (height < 0) {
                    action = ACTION_NORTH_WEST;
                    height = -height;
                    top -= height;
                }
                break;
            case ACTION_SOUTH_EAST:
                if (aspectRatio) {
                    if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
                        renderable = false;
                        break;
                    }
                    check(ACTION_EAST);
                    width += range.x;
                    height = width / aspectRatio;
                } else {
                    check(ACTION_SOUTH);
                    check(ACTION_EAST);
                    if (range.x >= 0) {
                        if (right < maxWidth) {
                            width += range.x;
                        } else if (range.y >= 0 && bottom >= maxHeight) {
                            renderable = false;
                        }
                    } else {
                        width += range.x;
                    }
                    if (range.y >= 0) {
                        if (bottom < maxHeight) {
                            height += range.y;
                        }
                    } else {
                        height += range.y;
                    }
                }
                if (width < 0 && height < 0) {
                    action = ACTION_NORTH_WEST;
                    height = -height;
                    width = -width;
                    top -= height;
                    left -= width;
                } else if (width < 0) {
                    action = ACTION_SOUTH_WEST;
                    width = -width;
                    left -= width;
                } else if (height < 0) {
                    action = ACTION_NORTH_EAST;
                    height = -height;
                    top -= height;
                }
                break;
            case ACTION_MOVE:
                this.move(range.x, range.y);
                renderable = false;
                break;
            case ACTION_ZOOM:
                this.zoom(getMaxZoomRatio(pointers), event);
                renderable = false;
                break;
            case ACTION_CROP:
                if (!range.x || !range.y) {
                    renderable = false;
                    break;
                }
                offset = getOffset(this.cropper);
                left = pointer.startX - offset.left;
                top = pointer.startY - offset.top;
                width = cropBoxData.minWidth;
                height = cropBoxData.minHeight;
                if (range.x > 0) {
                    action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
                } else if (range.x < 0) {
                    left -= width;
                    action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
                }
                if (range.y < 0) {
                    top -= height;
                }
                if (!this.cropped) {
                    removeClass(this.cropBox, CLASS_HIDDEN);
                    this.cropped = true;
                    if (this.limited) {
                        this.limitCropBox(true, true);
                    }
                }
                break;
        }
        if (renderable) {
            cropBoxData.width = width;
            cropBoxData.height = height;
            cropBoxData.left = left;
            cropBoxData.top = top;
            this.action = action;
            this.renderCropBox();
        }
        forEach(pointers, function(p) {
            p.startX = p.endX;
            p.startY = p.endY;
        });
    }
};
var methods = {
    // Show the crop box manually
    crop: function crop() {
        if (this.ready && !this.cropped && !this.disabled) {
            this.cropped = true;
            this.limitCropBox(true, true);
            if (this.options.modal) {
                addClass(this.dragBox, CLASS_MODAL);
            }
            removeClass(this.cropBox, CLASS_HIDDEN);
            this.setCropBoxData(this.initialCropBoxData);
        }
        return this;
    },
    // Reset the image and crop box to their initial states
    reset: function reset() {
        if (this.ready && !this.disabled) {
            this.imageData = assign({}, this.initialImageData);
            this.canvasData = assign({}, this.initialCanvasData);
            this.cropBoxData = assign({}, this.initialCropBoxData);
            this.renderCanvas();
            if (this.cropped) {
                this.renderCropBox();
            }
        }
        return this;
    },
    // Clear the crop box
    clear: function clear() {
        if (this.cropped && !this.disabled) {
            assign(this.cropBoxData, {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            });
            this.cropped = false;
            this.renderCropBox();
            this.limitCanvas(true, true);
            this.renderCanvas();
            removeClass(this.dragBox, CLASS_MODAL);
            addClass(this.cropBox, CLASS_HIDDEN);
        }
        return this;
    },
    /**
     * Replace the image's src and rebuild the cropper
     * @param {string} url - The new URL.
     * @param {boolean} [hasSameSize] - Indicate if the new image has the same size as the old one.
     * @returns {Cropper} this
     */
    replace: function replace(url) {
        var hasSameSize = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        if (!this.disabled && url) {
            if (this.isImg) {
                this.element.src = url;
            }
            if (hasSameSize) {
                this.url = url;
                this.image.src = url;
                if (this.ready) {
                    this.viewBoxImage.src = url;
                    forEach(this.previews, function(element) {
                        element.getElementsByTagName("img")[0].src = url;
                    });
                }
            } else {
                if (this.isImg) {
                    this.replaced = true;
                }
                this.options.data = null;
                this.uncreate();
                this.load(url);
            }
        }
        return this;
    },
    // Enable (unfreeze) the cropper
    enable: function enable() {
        if (this.ready && this.disabled) {
            this.disabled = false;
            removeClass(this.cropper, CLASS_DISABLED);
        }
        return this;
    },
    // Disable (freeze) the cropper
    disable: function disable() {
        if (this.ready && !this.disabled) {
            this.disabled = true;
            addClass(this.cropper, CLASS_DISABLED);
        }
        return this;
    },
    /**
     * Destroy the cropper and remove the instance from the image
     * @returns {Cropper} this
     */
    destroy: function destroy() {
        var element = this.element;
        if (!element[NAMESPACE]) {
            return this;
        }
        element[NAMESPACE] = void 0;
        if (this.isImg && this.replaced) {
            element.src = this.originalUrl;
        }
        this.uncreate();
        return this;
    },
    /**
     * Move the canvas with relative offsets
     * @param {number} offsetX - The relative offset distance on the x-axis.
     * @param {number} [offsetY=offsetX] - The relative offset distance on the y-axis.
     * @returns {Cropper} this
     */
    move: function move2(offsetX) {
        var offsetY = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : offsetX;
        var _this$canvasData = this.canvasData, left = _this$canvasData.left, top = _this$canvasData.top;
        return this.moveTo(isUndefined(offsetX) ? offsetX : left + Number(offsetX), isUndefined(offsetY) ? offsetY : top + Number(offsetY));
    },
    /**
     * Move the canvas to an absolute point
     * @param {number} x - The x-axis coordinate.
     * @param {number} [y=x] - The y-axis coordinate.
     * @returns {Cropper} this
     */
    moveTo: function moveTo(x) {
        var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
        var canvasData = this.canvasData;
        var changed = false;
        x = Number(x);
        y = Number(y);
        if (this.ready && !this.disabled && this.options.movable) {
            if (isNumber(x)) {
                canvasData.left = x;
                changed = true;
            }
            if (isNumber(y)) {
                canvasData.top = y;
                changed = true;
            }
            if (changed) {
                this.renderCanvas(true);
            }
        }
        return this;
    },
    /**
     * Zoom the canvas with a relative ratio
     * @param {number} ratio - The target ratio.
     * @param {Event} _originalEvent - The original event if any.
     * @returns {Cropper} this
     */
    zoom: function zoom(ratio, _originalEvent) {
        var canvasData = this.canvasData;
        ratio = Number(ratio);
        if (ratio < 0) {
            ratio = 1 / (1 - ratio);
        } else {
            ratio = 1 + ratio;
        }
        return this.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, null, _originalEvent);
    },
    /**
     * Zoom the canvas to an absolute ratio
     * @param {number} ratio - The target ratio.
     * @param {Object} pivot - The zoom pivot point coordinate.
     * @param {Event} _originalEvent - The original event if any.
     * @returns {Cropper} this
     */
    zoomTo: function zoomTo(ratio, pivot, _originalEvent) {
        var options = this.options, canvasData = this.canvasData;
        var width = canvasData.width, height = canvasData.height, naturalWidth = canvasData.naturalWidth, naturalHeight = canvasData.naturalHeight;
        ratio = Number(ratio);
        if (ratio >= 0 && this.ready && !this.disabled && options.zoomable) {
            var newWidth = naturalWidth * ratio;
            var newHeight = naturalHeight * ratio;
            if (dispatchEvent(this.element, EVENT_ZOOM, {
                ratio,
                oldRatio: width / naturalWidth,
                originalEvent: _originalEvent
            }) === false) {
                return this;
            }
            if (_originalEvent) {
                var pointers = this.pointers;
                var offset = getOffset(this.cropper);
                var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
                    pageX: _originalEvent.pageX,
                    pageY: _originalEvent.pageY
                };
                canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
                canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
            } else if (isPlainObject(pivot) && isNumber(pivot.x) && isNumber(pivot.y)) {
                canvasData.left -= (newWidth - width) * ((pivot.x - canvasData.left) / width);
                canvasData.top -= (newHeight - height) * ((pivot.y - canvasData.top) / height);
            } else {
                canvasData.left -= (newWidth - width) / 2;
                canvasData.top -= (newHeight - height) / 2;
            }
            canvasData.width = newWidth;
            canvasData.height = newHeight;
            this.renderCanvas(true);
        }
        return this;
    },
    /**
     * Rotate the canvas with a relative degree
     * @param {number} degree - The rotate degree.
     * @returns {Cropper} this
     */
    rotate: function rotate(degree) {
        return this.rotateTo((this.imageData.rotate || 0) + Number(degree));
    },
    /**
     * Rotate the canvas to an absolute degree
     * @param {number} degree - The rotate degree.
     * @returns {Cropper} this
     */
    rotateTo: function rotateTo(degree) {
        degree = Number(degree);
        if (isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
            this.imageData.rotate = degree % 360;
            this.renderCanvas(true, true);
        }
        return this;
    },
    /**
     * Scale the image on the x-axis.
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @returns {Cropper} this
     */
    scaleX: function scaleX(_scaleX) {
        var scaleY2 = this.imageData.scaleY;
        return this.scale(_scaleX, isNumber(scaleY2) ? scaleY2 : 1);
    },
    /**
     * Scale the image on the y-axis.
     * @param {number} scaleY - The scale ratio on the y-axis.
     * @returns {Cropper} this
     */
    scaleY: function scaleY(_scaleY) {
        var scaleX2 = this.imageData.scaleX;
        return this.scale(isNumber(scaleX2) ? scaleX2 : 1, _scaleY);
    },
    /**
     * Scale the image
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
     * @returns {Cropper} this
     */
    scale: function scale(scaleX2) {
        var scaleY2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : scaleX2;
        var imageData = this.imageData;
        var transformed = false;
        scaleX2 = Number(scaleX2);
        scaleY2 = Number(scaleY2);
        if (this.ready && !this.disabled && this.options.scalable) {
            if (isNumber(scaleX2)) {
                imageData.scaleX = scaleX2;
                transformed = true;
            }
            if (isNumber(scaleY2)) {
                imageData.scaleY = scaleY2;
                transformed = true;
            }
            if (transformed) {
                this.renderCanvas(true, true);
            }
        }
        return this;
    },
    /**
     * Get the cropped area position and size data (base on the original image)
     * @param {boolean} [rounded=false] - Indicate if round the data values or not.
     * @returns {Object} The result cropped data.
     */
    getData: function getData2() {
        var rounded = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        var options = this.options, imageData = this.imageData, canvasData = this.canvasData, cropBoxData = this.cropBoxData;
        var data;
        if (this.ready && this.cropped) {
            data = {
                x: cropBoxData.left - canvasData.left,
                y: cropBoxData.top - canvasData.top,
                width: cropBoxData.width,
                height: cropBoxData.height
            };
            var ratio = imageData.width / imageData.naturalWidth;
            forEach(data, function(n, i) {
                data[i] = n / ratio;
            });
            if (rounded) {
                var bottom = Math.round(data.y + data.height);
                var right = Math.round(data.x + data.width);
                data.x = Math.round(data.x);
                data.y = Math.round(data.y);
                data.width = right - data.x;
                data.height = bottom - data.y;
            }
        } else {
            data = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
        if (options.rotatable) {
            data.rotate = imageData.rotate || 0;
        }
        if (options.scalable) {
            data.scaleX = imageData.scaleX || 1;
            data.scaleY = imageData.scaleY || 1;
        }
        return data;
    },
    /**
     * Set the cropped area position and size with new data
     * @param {Object} data - The new data.
     * @returns {Cropper} this
     */
    setData: function setData2(data) {
        var options = this.options, imageData = this.imageData, canvasData = this.canvasData;
        var cropBoxData = {};
        if (this.ready && !this.disabled && isPlainObject(data)) {
            var transformed = false;
            if (options.rotatable) {
                if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
                    imageData.rotate = data.rotate;
                    transformed = true;
                }
            }
            if (options.scalable) {
                if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
                    imageData.scaleX = data.scaleX;
                    transformed = true;
                }
                if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
                    imageData.scaleY = data.scaleY;
                    transformed = true;
                }
            }
            if (transformed) {
                this.renderCanvas(true, true);
            }
            var ratio = imageData.width / imageData.naturalWidth;
            if (isNumber(data.x)) {
                cropBoxData.left = data.x * ratio + canvasData.left;
            }
            if (isNumber(data.y)) {
                cropBoxData.top = data.y * ratio + canvasData.top;
            }
            if (isNumber(data.width)) {
                cropBoxData.width = data.width * ratio;
            }
            if (isNumber(data.height)) {
                cropBoxData.height = data.height * ratio;
            }
            this.setCropBoxData(cropBoxData);
        }
        return this;
    },
    /**
     * Get the container size data.
     * @returns {Object} The result container data.
     */
    getContainerData: function getContainerData() {
        return this.ready ? assign({}, this.containerData) : {};
    },
    /**
     * Get the image position and size data.
     * @returns {Object} The result image data.
     */
    getImageData: function getImageData() {
        return this.sized ? assign({}, this.imageData) : {};
    },
    /**
     * Get the canvas position and size data.
     * @returns {Object} The result canvas data.
     */
    getCanvasData: function getCanvasData() {
        var canvasData = this.canvasData;
        var data = {};
        if (this.ready) {
            forEach(["left", "top", "width", "height", "naturalWidth", "naturalHeight"], function(n) {
                data[n] = canvasData[n];
            });
        }
        return data;
    },
    /**
     * Set the canvas position and size with new data.
     * @param {Object} data - The new canvas data.
     * @returns {Cropper} this
     */
    setCanvasData: function setCanvasData(data) {
        var canvasData = this.canvasData;
        var aspectRatio = canvasData.aspectRatio;
        if (this.ready && !this.disabled && isPlainObject(data)) {
            if (isNumber(data.left)) {
                canvasData.left = data.left;
            }
            if (isNumber(data.top)) {
                canvasData.top = data.top;
            }
            if (isNumber(data.width)) {
                canvasData.width = data.width;
                canvasData.height = data.width / aspectRatio;
            } else if (isNumber(data.height)) {
                canvasData.height = data.height;
                canvasData.width = data.height * aspectRatio;
            }
            this.renderCanvas(true);
        }
        return this;
    },
    /**
     * Get the crop box position and size data.
     * @returns {Object} The result crop box data.
     */
    getCropBoxData: function getCropBoxData() {
        var cropBoxData = this.cropBoxData;
        var data;
        if (this.ready && this.cropped) {
            data = {
                left: cropBoxData.left,
                top: cropBoxData.top,
                width: cropBoxData.width,
                height: cropBoxData.height
            };
        }
        return data || {};
    },
    /**
     * Set the crop box position and size with new data.
     * @param {Object} data - The new crop box data.
     * @returns {Cropper} this
     */
    setCropBoxData: function setCropBoxData(data) {
        var cropBoxData = this.cropBoxData;
        var aspectRatio = this.options.aspectRatio;
        var widthChanged;
        var heightChanged;
        if (this.ready && this.cropped && !this.disabled && isPlainObject(data)) {
            if (isNumber(data.left)) {
                cropBoxData.left = data.left;
            }
            if (isNumber(data.top)) {
                cropBoxData.top = data.top;
            }
            if (isNumber(data.width) && data.width !== cropBoxData.width) {
                widthChanged = true;
                cropBoxData.width = data.width;
            }
            if (isNumber(data.height) && data.height !== cropBoxData.height) {
                heightChanged = true;
                cropBoxData.height = data.height;
            }
            if (aspectRatio) {
                if (widthChanged) {
                    cropBoxData.height = cropBoxData.width / aspectRatio;
                } else if (heightChanged) {
                    cropBoxData.width = cropBoxData.height * aspectRatio;
                }
            }
            this.renderCropBox();
        }
        return this;
    },
    /**
     * Get a canvas drawn the cropped image.
     * @param {Object} [options={}] - The config options.
     * @returns {HTMLCanvasElement} - The result canvas.
     */
    getCroppedCanvas: function getCroppedCanvas() {
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        if (!this.ready || !window.HTMLCanvasElement) {
            return null;
        }
        var canvasData = this.canvasData;
        var source = getSourceCanvas(this.image, this.imageData, canvasData, options);
        if (!this.cropped) {
            return source;
        }
        var _this$getData = this.getData(), initialX = _this$getData.x, initialY = _this$getData.y, initialWidth = _this$getData.width, initialHeight = _this$getData.height;
        var ratio = source.width / Math.floor(canvasData.naturalWidth);
        if (ratio !== 1) {
            initialX *= ratio;
            initialY *= ratio;
            initialWidth *= ratio;
            initialHeight *= ratio;
        }
        var aspectRatio = initialWidth / initialHeight;
        var maxSizes = getAdjustedSizes({
            aspectRatio,
            width: options.maxWidth || Infinity,
            height: options.maxHeight || Infinity
        });
        var minSizes = getAdjustedSizes({
            aspectRatio,
            width: options.minWidth || 0,
            height: options.minHeight || 0
        }, "cover");
        var _getAdjustedSizes = getAdjustedSizes({
            aspectRatio,
            width: options.width || (ratio !== 1 ? source.width : initialWidth),
            height: options.height || (ratio !== 1 ? source.height : initialHeight)
        }), width = _getAdjustedSizes.width, height = _getAdjustedSizes.height;
        width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
        height = Math.min(maxSizes.height, Math.max(minSizes.height, height));
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = normalizeDecimalNumber(width);
        canvas.height = normalizeDecimalNumber(height);
        context.fillStyle = options.fillColor || "transparent";
        context.fillRect(0, 0, width, height);
        var _options$imageSmoothi = options.imageSmoothingEnabled, imageSmoothingEnabled = _options$imageSmoothi === void 0 ? true : _options$imageSmoothi, imageSmoothingQuality = options.imageSmoothingQuality;
        context.imageSmoothingEnabled = imageSmoothingEnabled;
        if (imageSmoothingQuality) {
            context.imageSmoothingQuality = imageSmoothingQuality;
        }
        var sourceWidth = source.width;
        var sourceHeight = source.height;
        var srcX = initialX;
        var srcY = initialY;
        var srcWidth;
        var srcHeight;
        var dstX;
        var dstY;
        var dstWidth;
        var dstHeight;
        if (srcX <= -initialWidth || srcX > sourceWidth) {
            srcX = 0;
            srcWidth = 0;
            dstX = 0;
            dstWidth = 0;
        } else if (srcX <= 0) {
            dstX = -srcX;
            srcX = 0;
            srcWidth = Math.min(sourceWidth, initialWidth + srcX);
            dstWidth = srcWidth;
        } else if (srcX <= sourceWidth) {
            dstX = 0;
            srcWidth = Math.min(initialWidth, sourceWidth - srcX);
            dstWidth = srcWidth;
        }
        if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
            srcY = 0;
            srcHeight = 0;
            dstY = 0;
            dstHeight = 0;
        } else if (srcY <= 0) {
            dstY = -srcY;
            srcY = 0;
            srcHeight = Math.min(sourceHeight, initialHeight + srcY);
            dstHeight = srcHeight;
        } else if (srcY <= sourceHeight) {
            dstY = 0;
            srcHeight = Math.min(initialHeight, sourceHeight - srcY);
            dstHeight = srcHeight;
        }
        var params = [srcX, srcY, srcWidth, srcHeight];
        if (dstWidth > 0 && dstHeight > 0) {
            var scale2 = width / initialWidth;
            params.push(dstX * scale2, dstY * scale2, dstWidth * scale2, dstHeight * scale2);
        }
        context.drawImage.apply(context, [source].concat(_toConsumableArray(params.map(function(param) {
            return Math.floor(normalizeDecimalNumber(param));
        }))));
        return canvas;
    },
    /**
     * Change the aspect ratio of the crop box.
     * @param {number} aspectRatio - The new aspect ratio.
     * @returns {Cropper} this
     */
    setAspectRatio: function setAspectRatio(aspectRatio) {
        var options = this.options;
        if (!this.disabled && !isUndefined(aspectRatio)) {
            options.aspectRatio = Math.max(0, aspectRatio) || NaN;
            if (this.ready) {
                this.initCropBox();
                if (this.cropped) {
                    this.renderCropBox();
                }
            }
        }
        return this;
    },
    /**
     * Change the drag mode.
     * @param {string} mode - The new drag mode.
     * @returns {Cropper} this
     */
    setDragMode: function setDragMode(mode) {
        var options = this.options, dragBox = this.dragBox, face = this.face;
        if (this.ready && !this.disabled) {
            var croppable = mode === DRAG_MODE_CROP;
            var movable = options.movable && mode === DRAG_MODE_MOVE;
            mode = croppable || movable ? mode : DRAG_MODE_NONE;
            options.dragMode = mode;
            setData(dragBox, DATA_ACTION, mode);
            toggleClass(dragBox, CLASS_CROP, croppable);
            toggleClass(dragBox, CLASS_MOVE, movable);
            if (!options.cropBoxMovable) {
                setData(face, DATA_ACTION, mode);
                toggleClass(face, CLASS_CROP, croppable);
                toggleClass(face, CLASS_MOVE, movable);
            }
        }
        return this;
    }
};
var AnotherCropper = WINDOW.Cropper;
var Cropper = /* @__PURE__ */ function() {
    function Cropper2(element) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        _classCallCheck(this, Cropper2);
        if (!element || !REGEXP_TAG_NAME.test(element.tagName)) {
            throw new Error("The first argument is required and must be an <img> or <canvas> element.");
        }
        this.element = element;
        this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
        this.cropped = false;
        this.disabled = false;
        this.pointers = {};
        this.ready = false;
        this.reloading = false;
        this.replaced = false;
        this.sized = false;
        this.sizing = false;
        this.init();
    }
    _createClass(Cropper2, [{
        key: "init",
        value: function init() {
            var element = this.element;
            var tagName = element.tagName.toLowerCase();
            var url;
            if (element[NAMESPACE]) {
                return;
            }
            element[NAMESPACE] = this;
            if (tagName === "img") {
                this.isImg = true;
                url = element.getAttribute("src") || "";
                this.originalUrl = url;
                if (!url) {
                    return;
                }
                url = element.src;
            } else if (tagName === "canvas" && window.HTMLCanvasElement) {
                url = element.toDataURL();
            }
            this.load(url);
        }
    }, {
        key: "load",
        value: function load(url) {
            var _this = this;
            if (!url) {
                return;
            }
            this.url = url;
            this.imageData = {};
            var element = this.element, options = this.options;
            if (!options.rotatable && !options.scalable) {
                options.checkOrientation = false;
            }
            if (!options.checkOrientation || !window.ArrayBuffer) {
                this.clone();
                return;
            }
            if (REGEXP_DATA_URL.test(url)) {
                if (REGEXP_DATA_URL_JPEG.test(url)) {
                    this.read(dataURLToArrayBuffer(url));
                } else {
                    this.clone();
                }
                return;
            }
            var xhr = new XMLHttpRequest();
            var clone = this.clone.bind(this);
            this.reloading = true;
            this.xhr = xhr;
            xhr.onabort = clone;
            xhr.onerror = clone;
            xhr.ontimeout = clone;
            xhr.onprogress = function() {
                if (xhr.getResponseHeader("content-type") !== MIME_TYPE_JPEG) {
                    xhr.abort();
                }
            };
            xhr.onload = function() {
                _this.read(xhr.response);
            };
            xhr.onloadend = function() {
                _this.reloading = false;
                _this.xhr = null;
            };
            if (options.checkCrossOrigin && isCrossOriginURL(url) && element.crossOrigin) {
                url = addTimestamp(url);
            }
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.withCredentials = element.crossOrigin === "use-credentials";
            xhr.send();
        }
    }, {
        key: "read",
        value: function read(arrayBuffer) {
            var options = this.options, imageData = this.imageData;
            var orientation = resetAndGetOrientation(arrayBuffer);
            var rotate2 = 0;
            var scaleX2 = 1;
            var scaleY2 = 1;
            if (orientation > 1) {
                this.url = arrayBufferToDataURL(arrayBuffer, MIME_TYPE_JPEG);
                var _parseOrientation = parseOrientation(orientation);
                rotate2 = _parseOrientation.rotate;
                scaleX2 = _parseOrientation.scaleX;
                scaleY2 = _parseOrientation.scaleY;
            }
            if (options.rotatable) {
                imageData.rotate = rotate2;
            }
            if (options.scalable) {
                imageData.scaleX = scaleX2;
                imageData.scaleY = scaleY2;
            }
            this.clone();
        }
    }, {
        key: "clone",
        value: function clone() {
            var element = this.element, url = this.url;
            var crossOrigin = element.crossOrigin;
            var crossOriginUrl = url;
            if (this.options.checkCrossOrigin && isCrossOriginURL(url)) {
                if (!crossOrigin) {
                    crossOrigin = "anonymous";
                }
                crossOriginUrl = addTimestamp(url);
            }
            this.crossOrigin = crossOrigin;
            this.crossOriginUrl = crossOriginUrl;
            var image = document.createElement("img");
            if (crossOrigin) {
                image.crossOrigin = crossOrigin;
            }
            image.src = crossOriginUrl || url;
            image.alt = element.alt || "The image to crop";
            this.image = image;
            image.onload = this.start.bind(this);
            image.onerror = this.stop.bind(this);
            addClass(image, CLASS_HIDE);
            element.parentNode.insertBefore(image, element.nextSibling);
        }
    }, {
        key: "start",
        value: function start() {
            var _this2 = this;
            var image = this.image;
            image.onload = null;
            image.onerror = null;
            this.sizing = true;
            var isIOSWebKit = WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(WINDOW.navigator.userAgent);
            var done = function done2(naturalWidth, naturalHeight) {
                assign(_this2.imageData, {
                    naturalWidth,
                    naturalHeight,
                    aspectRatio: naturalWidth / naturalHeight
                });
                _this2.initialImageData = assign({}, _this2.imageData);
                _this2.sizing = false;
                _this2.sized = true;
                _this2.build();
            };
            if (image.naturalWidth && !isIOSWebKit) {
                done(image.naturalWidth, image.naturalHeight);
                return;
            }
            var sizingImage = document.createElement("img");
            var body = document.body || document.documentElement;
            this.sizingImage = sizingImage;
            sizingImage.onload = function() {
                done(sizingImage.width, sizingImage.height);
                if (!isIOSWebKit) {
                    body.removeChild(sizingImage);
                }
            };
            sizingImage.src = image.src;
            if (!isIOSWebKit) {
                sizingImage.style.cssText = "left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;";
                body.appendChild(sizingImage);
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            var image = this.image;
            image.onload = null;
            image.onerror = null;
            image.parentNode.removeChild(image);
            this.image = null;
        }
    }, {
        key: "build",
        value: function build() {
            if (!this.sized || this.ready) {
                return;
            }
            var element = this.element, options = this.options, image = this.image;
            var container = element.parentNode;
            var template = document.createElement("div");
            template.innerHTML = TEMPLATE;
            var cropper2 = template.querySelector(".".concat(NAMESPACE, "-container"));
            var canvas = cropper2.querySelector(".".concat(NAMESPACE, "-canvas"));
            var dragBox = cropper2.querySelector(".".concat(NAMESPACE, "-drag-box"));
            var cropBox = cropper2.querySelector(".".concat(NAMESPACE, "-crop-box"));
            var face = cropBox.querySelector(".".concat(NAMESPACE, "-face"));
            this.container = container;
            this.cropper = cropper2;
            this.canvas = canvas;
            this.dragBox = dragBox;
            this.cropBox = cropBox;
            this.viewBox = cropper2.querySelector(".".concat(NAMESPACE, "-view-box"));
            this.face = face;
            canvas.appendChild(image);
            addClass(element, CLASS_HIDDEN);
            container.insertBefore(cropper2, element.nextSibling);
            removeClass(image, CLASS_HIDE);
            this.initPreview();
            this.bind();
            options.initialAspectRatio = Math.max(0, options.initialAspectRatio) || NaN;
            options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
            options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
            addClass(cropBox, CLASS_HIDDEN);
            if (!options.guides) {
                addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-dashed")), CLASS_HIDDEN);
            }
            if (!options.center) {
                addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-center")), CLASS_HIDDEN);
            }
            if (options.background) {
                addClass(cropper2, "".concat(NAMESPACE, "-bg"));
            }
            if (!options.highlight) {
                addClass(face, CLASS_INVISIBLE);
            }
            if (options.cropBoxMovable) {
                addClass(face, CLASS_MOVE);
                setData(face, DATA_ACTION, ACTION_ALL);
            }
            if (!options.cropBoxResizable) {
                addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-line")), CLASS_HIDDEN);
                addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-point")), CLASS_HIDDEN);
            }
            this.render();
            this.ready = true;
            this.setDragMode(options.dragMode);
            if (options.autoCrop) {
                this.crop();
            }
            this.setData(options.data);
            if (isFunction(options.ready)) {
                addListener(element, EVENT_READY, options.ready, {
                    once: true
                });
            }
            dispatchEvent(element, EVENT_READY);
        }
    }, {
        key: "unbuild",
        value: function unbuild() {
            if (!this.ready) {
                return;
            }
            this.ready = false;
            this.unbind();
            this.resetPreview();
            var parentNode = this.cropper.parentNode;
            if (parentNode) {
                parentNode.removeChild(this.cropper);
            }
            removeClass(this.element, CLASS_HIDDEN);
        }
    }, {
        key: "uncreate",
        value: function uncreate() {
            if (this.ready) {
                this.unbuild();
                this.ready = false;
                this.cropped = false;
            } else if (this.sizing) {
                this.sizingImage.onload = null;
                this.sizing = false;
                this.sized = false;
            } else if (this.reloading) {
                this.xhr.onabort = null;
                this.xhr.abort();
            } else if (this.image) {
                this.stop();
            }
        }
        /**
         * Get the no conflict cropper class.
         * @returns {Cropper} The cropper class.
         */
    }], [{
        key: "noConflict",
        value: function noConflict() {
            window.Cropper = AnotherCropper;
            return Cropper2;
        }
        /**
         * Change the default options.
         * @param {Object} options - The new default options.
         */
    }, {
        key: "setDefaults",
        value: function setDefaults(options) {
            assign(DEFAULTS, isPlainObject(options) && options);
        }
    }]);
    return Cropper2;
}();
assign(Cropper.prototype, render2, preview, events, handlers, change, methods);
const cropper = "";
function toValue(r) {
    return typeof r === "function" ? r() : vue.unref(r);
}
const noop = () => {
};
function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
        return new Promise((resolve, reject) => {
            Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
        });
    }
    return wrapper;
}
function debounceFilter(ms, options = {}) {
    let timer;
    let maxTimer;
    let lastRejector = noop;
    const _clearTimeout = (timer2) => {
        clearTimeout(timer2);
        lastRejector();
        lastRejector = noop;
    };
    const filter = (invoke) => {
        const duration = toValue(ms);
        const maxDuration = toValue(options.maxWait);
        if (timer)
            _clearTimeout(timer);
        if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
            if (maxTimer) {
                _clearTimeout(maxTimer);
                maxTimer = null;
            }
            return Promise.resolve(invoke());
        }
        return new Promise((resolve, reject) => {
            lastRejector = options.rejectOnCancel ? reject : resolve;
            if (maxDuration && !maxTimer) {
                maxTimer = setTimeout(() => {
                    if (timer)
                        _clearTimeout(timer);
                    maxTimer = null;
                    resolve(invoke());
                }, maxDuration);
            }
            timer = setTimeout(() => {
                if (maxTimer)
                    _clearTimeout(maxTimer);
                maxTimer = null;
                resolve(invoke());
            }, duration);
        });
    };
    return filter;
}
function useDebounceFn(fn, ms = 200, options = {}) {
    return createFilterWrapper(
        debounceFilter(ms, options),
        fn
    );
}
const defaultOptions = {
    aspectRatio: 1,
    zoomable: true,
    zoomOnTouch: true,
    zoomOnWheel: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
    autoCrop: true,
    background: true,
    highlight: true,
    center: true,
    responsive: true,
    restore: true,
    checkCrossOrigin: true,
    checkOrientation: true,
    scalable: true,
    modal: true,
    guides: true,
    movable: true,
    rotatable: true
};
const props$3 = {
    src: { type: String, required: true },
    alt: { type: String },
    circled: { type: Boolean, default: false },
    realTimePreview: { type: Boolean, default: true },
    height: { type: [String, Number], default: "360px" },
    crossorigin: {
        type: String,
        default: void 0
    },
    imageStyle: { type: Object, default: () => ({}) },
    options: { type: Object, default: () => ({}) }
};
const _sfc_main$h = vue.defineComponent({
    name: "CropperImage",
    props: props$3,
    emits: ["cropend", "ready", "cropendError"],
    setup(props2, { attrs, emit }) {
        const imgElRef = vue.ref();
        const cropper2 = vue.ref();
        const isReady = vue.ref(false);
        const prefixCls2 = "shy-cropper-image";
        const debounceRealTimeCroppered = useDebounceFn(realTimeCroppered, 80);
        const getImageStyle = vue.computed(() => {
            return {
                height: props2.height,
                maxWidth: "100%",
                ...props2.imageStyle
            };
        });
        const getClass = vue.computed(() => {
            return [
                prefixCls2,
                attrs.class,
                {
                    [`${prefixCls2}--circled`]: props2.circled
                }
            ];
        });
        const getWrapperStyle = vue.computed(() => {
            return { height: `${props2.height}`.replace(/px/, "") + "px" };
        });
        vue.onMounted(init);
        vue.onUnmounted(() => {
            var _a2;
            (_a2 = cropper2.value) == null ? void 0 : _a2.destroy();
        });
        async function init() {
            const imgEl = vue.unref(imgElRef);
            if (!imgEl) {
                return;
            }
            cropper2.value = new Cropper(imgEl, {
                ...defaultOptions,
                ready: () => {
                    isReady.value = true;
                    realTimeCroppered();
                    emit("ready", cropper2.value);
                },
                crop() {
                    debounceRealTimeCroppered();
                },
                zoom() {
                    debounceRealTimeCroppered();
                },
                cropmove() {
                    debounceRealTimeCroppered();
                },
                ...props2.options
            });
        }
        function realTimeCroppered() {
            props2.realTimePreview && croppered();
        }
        function croppered() {
            if (!cropper2.value) {
                return;
            }
            let imgInfo = cropper2.value.getData();
            const canvas = props2.circled ? getRoundedCanvas() : cropper2.value.getCroppedCanvas();
            canvas.toBlob((blob) => {
                if (!blob) {
                    return;
                }
                let fileReader = new FileReader();
                fileReader.readAsDataURL(blob);
                fileReader.onloadend = (e) => {
                    var _a2;
                    emit("cropend", {
                        imgBase64: ((_a2 = e.target) == null ? void 0 : _a2.result) ?? "",
                        imgInfo
                    });
                };
                fileReader.onerror = () => {
                    emit("cropendError");
                };
            }, "image/png");
        }
        function getRoundedCanvas() {
            const sourceCanvas = cropper2.value.getCroppedCanvas();
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const width = sourceCanvas.width;
            const height = sourceCanvas.height;
            canvas.width = width;
            canvas.height = height;
            context.imageSmoothingEnabled = true;
            context.drawImage(sourceCanvas, 0, 0, width, height);
            context.globalCompositeOperation = "destination-in";
            context.beginPath();
            context.arc(
                width / 2,
                height / 2,
                Math.min(width, height) / 2,
                0,
                2 * Math.PI,
                true
            );
            context.fill();
            return canvas;
        }
        return {
            getClass,
            imgElRef,
            getWrapperStyle,
            getImageStyle,
            isReady,
            croppered
        };
    }
});
const Cropper_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$9 = ["src", "alt", "crossorigin"];
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(_ctx.getClass),
        style: vue.normalizeStyle(_ctx.getWrapperStyle)
    }, [
        vue.withDirectives(vue.createElementVNode("img", {
            ref: "imgElRef",
            src: _ctx.src,
            alt: _ctx.alt,
            crossorigin: _ctx.crossorigin,
            style: vue.normalizeStyle(_ctx.getImageStyle)
        }, null, 12, _hoisted_1$9), [
            [vue.vShow, _ctx.isReady]
        ])
    ], 6);
}
const CropperImage = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$c]]);
const props$2 = {
    circled: { type: Boolean, default: true },
    uploadApi: {
        type: Function
    }
};
const _sfc_main$g = vue.defineComponent({
    name: "CropperModal",
    components: {
        BasicModal,
        Space: antDesignVue.Space,
        CropperImage,
        Upload: antDesignVue.Upload,
        Avatar: antDesignVue.Avatar,
        Tooltip: antDesignVue.Tooltip,
        BasicButton: _sfc_main$Y
    },
    props: props$2,
    emits: ["uploadSuccess", "register", "beforeUpload"],
    setup(props2, { emit }) {
        let filename = "";
        const src = vue.ref("");
        const previewSource = vue.ref("");
        const cropper2 = vue.ref();
        let scaleX2 = 1;
        let scaleY2 = 1;
        const prefixCls2 = "shy-cropper-am";
        const [register, { closeModal, setModalProps }] = useModalInner(() => {
            src.value = "";
            previewSource.value = "";
            filename = "";
        });
        function handleBeforeUpload(file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            src.value = "";
            previewSource.value = "";
            reader.onload = function(e) {
                var _a2;
                src.value = ((_a2 = e.target) == null ? void 0 : _a2.result) ?? "";
                filename = file.name;
            };
            return false;
        }
        function handleCropend({ imgBase64 }) {
            previewSource.value = imgBase64;
        }
        function handleReady(cropperInstance) {
            cropper2.value = cropperInstance;
        }
        function handlerToolbar(event, arg) {
            var _a2, _b;
            if (event === "scaleX") {
                scaleX2 = arg = scaleX2 === -1 ? 1 : -1;
            }
            if (event === "scaleY") {
                scaleY2 = arg = scaleY2 === -1 ? 1 : -1;
            }
            (_b = (_a2 = cropper2 == null ? void 0 : cropper2.value) == null ? void 0 : _a2[event]) == null ? void 0 : _b.call(_a2, arg);
        }
        async function handleOk() {
            const uploadApi = props2.uploadApi;
            if (uploadApi && utils.isFunction(uploadApi)) {
                const blob = utils.dataURLtoBlob(previewSource.value);
                try {
                    setModalProps({ confirmLoading: true });
                    const result = await uploadApi({ name: "file", file: blob, filename });
                    emit("uploadSuccess", {
                        source: previewSource.value,
                        data: result.data
                    });
                    closeModal();
                } finally {
                    setModalProps({ confirmLoading: false });
                }
            } else {
                emit("beforeUpload", {
                    file: utils.dataURLtoBlob(previewSource.value),
                    filename,
                    closeModal
                });
            }
        }
        return {
            prefixCls: prefixCls2,
            src,
            register,
            previewSource,
            handleBeforeUpload,
            handleCropend,
            handleReady,
            handlerToolbar,
            handleOk
        };
    }
});
const CopperModal_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$8 = ["src"];
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_CropperImage = vue.resolveComponent("CropperImage");
    const _component_BasicButton = vue.resolveComponent("BasicButton");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    const _component_Upload = vue.resolveComponent("Upload");
    const _component_Space = vue.resolveComponent("Space");
    const _component_Avatar = vue.resolveComponent("Avatar");
    const _component_BasicModal = vue.resolveComponent("BasicModal");
    return vue.openBlock(), vue.createBlock(_component_BasicModal, vue.mergeProps(_ctx.$attrs, {
        onRegister: _ctx.register,
        title: "头像上传",
        width: "800px",
        canFullscreen: false,
        onOk: _ctx.handleOk,
        okText: "确认并上传",
        "destroy-on-close": ""
    }), {
        default: vue.withCtx(() => [
            vue.createElementVNode("div", {
                class: vue.normalizeClass(_ctx.prefixCls)
            }, [
                vue.createElementVNode("div", {
                    class: vue.normalizeClass(`${_ctx.prefixCls}-left`)
                }, [
                    vue.createElementVNode("div", {
                        class: vue.normalizeClass(`${_ctx.prefixCls}-cropper`)
                    }, [
                        _ctx.src ? (vue.openBlock(), vue.createBlock(_component_CropperImage, {
                            key: 0,
                            src: _ctx.src,
                            height: "300px",
                            circled: _ctx.circled,
                            onCropend: _ctx.handleCropend,
                            onReady: _ctx.handleReady
                        }, null, 8, ["src", "circled", "onCropend", "onReady"])) : vue.createCommentVNode("", true)
                    ], 2),
                    vue.createElementVNode("div", {
                        class: vue.normalizeClass(`${_ctx.prefixCls}-toolbar`)
                    }, [
                        vue.createVNode(_component_Upload, {
                            fileList: [],
                            accept: "image/*",
                            beforeUpload: _ctx.handleBeforeUpload
                        }, {
                            default: vue.withCtx(() => [
                                vue.createVNode(_component_Tooltip, {
                                    title: "选择图片",
                                    placement: "bottom"
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(_component_BasicButton, {
                                            size: "small",
                                            preIcon: "ant-design:upload-outlined",
                                            type: "primary"
                                        })
                                    ]),
                                    _: 1
                                })
                            ]),
                            _: 1
                        }, 8, ["beforeUpload"]),
                        vue.createVNode(_component_Space, null, {
                            default: vue.withCtx(() => [
                                vue.createVNode(_component_Tooltip, {
                                    title: "重置",
                                    placement: "bottom"
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(_component_BasicButton, {
                                            type: "primary",
                                            preIcon: "ant-design:reload-outlined",
                                            size: "small",
                                            disabled: !_ctx.src,
                                            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handlerToolbar("reset"))
                                        }, null, 8, ["disabled"])
                                    ]),
                                    _: 1
                                }),
                                vue.createVNode(_component_Tooltip, {
                                    title: "逆时针旋转",
                                    placement: "bottom"
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(_component_BasicButton, {
                                            type: "primary",
                                            preIcon: "ant-design:rotate-left-outlined",
                                            size: "small",
                                            disabled: !_ctx.src,
                                            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.handlerToolbar("rotate", -45))
                                        }, null, 8, ["disabled"])
                                    ]),
                                    _: 1
                                }),
                                vue.createVNode(_component_Tooltip, {
                                    title: "顺时针旋转",
                                    placement: "bottom"
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(_component_BasicButton, {
                                            type: "primary",
                                            preIcon: "ant-design:rotate-right-outlined",
                                            size: "small",
                                            disabled: !_ctx.src,
                                            onClick: _cache[2] || (_cache[2] = ($event) => _ctx.handlerToolbar("rotate", 45))
                                        }, null, 8, ["disabled"])
                                    ]),
                                    _: 1
                                }),
                                vue.createVNode(_component_Tooltip, {
                                    title: "水平翻转",
                                    placement: "bottom"
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(_component_BasicButton, {
                                            type: "primary",
                                            preIcon: "vaadin:arrows-long-h",
                                            size: "small",
                                            disabled: !_ctx.src,
                                            onClick: _cache[3] || (_cache[3] = ($event) => _ctx.handlerToolbar("scaleX"))
                                        }, null, 8, ["disabled"])
                                    ]),
                                    _: 1
                                }),
                                vue.createVNode(_component_Tooltip, {
                                    title: "垂直翻转",
                                    placement: "bottom"
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(_component_BasicButton, {
                                            type: "primary",
                                            preIcon: "vaadin:arrows-long-v",
                                            size: "small",
                                            disabled: !_ctx.src,
                                            onClick: _cache[4] || (_cache[4] = ($event) => _ctx.handlerToolbar("scaleY"))
                                        }, null, 8, ["disabled"])
                                    ]),
                                    _: 1
                                }),
                                vue.createVNode(_component_Tooltip, {
                                    title: "放大",
                                    placement: "bottom"
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(_component_BasicButton, {
                                            type: "primary",
                                            preIcon: "ant-design:zoom-in-outlined",
                                            size: "small",
                                            disabled: !_ctx.src,
                                            onClick: _cache[5] || (_cache[5] = ($event) => _ctx.handlerToolbar("zoom", 0.1))
                                        }, null, 8, ["disabled"])
                                    ]),
                                    _: 1
                                }),
                                vue.createVNode(_component_Tooltip, {
                                    title: "缩小",
                                    placement: "bottom"
                                }, {
                                    default: vue.withCtx(() => [
                                        vue.createVNode(_component_BasicButton, {
                                            type: "primary",
                                            preIcon: "ant-design:zoom-out-outlined",
                                            size: "small",
                                            disabled: !_ctx.src,
                                            onClick: _cache[6] || (_cache[6] = ($event) => _ctx.handlerToolbar("zoom", -0.1))
                                        }, null, 8, ["disabled"])
                                    ]),
                                    _: 1
                                })
                            ]),
                            _: 1
                        })
                    ], 2)
                ], 2),
                vue.createElementVNode("div", {
                    class: vue.normalizeClass(`${_ctx.prefixCls}-right`)
                }, [
                    vue.createElementVNode("div", {
                        class: vue.normalizeClass(`${_ctx.prefixCls}-preview`)
                    }, [
                        _ctx.previewSource ? (vue.openBlock(), vue.createElementBlock("img", {
                            key: 0,
                            src: _ctx.previewSource,
                            alt: "预览"
                        }, null, 8, _hoisted_1$8)) : vue.createCommentVNode("", true)
                    ], 2),
                    _ctx.previewSource ? (vue.openBlock(), vue.createElementBlock("div", {
                        key: 0,
                        class: vue.normalizeClass(`${_ctx.prefixCls}-group`)
                    }, [
                        vue.createVNode(_component_Avatar, {
                            src: _ctx.previewSource,
                            size: "large"
                        }, null, 8, ["src"]),
                        vue.createVNode(_component_Avatar, {
                            src: _ctx.previewSource,
                            size: 48
                        }, null, 8, ["src"]),
                        vue.createVNode(_component_Avatar, {
                            src: _ctx.previewSource,
                            size: 64
                        }, null, 8, ["src"]),
                        vue.createVNode(_component_Avatar, {
                            src: _ctx.previewSource,
                            size: 80
                        }, null, 8, ["src"])
                    ], 2)) : vue.createCommentVNode("", true)
                ], 2)
            ], 2)
        ]),
        _: 1
    }, 16, ["onRegister", "onOk"]);
}
const CopperModal = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$b]]);
const props$1 = {
    width: { type: [String, Number], default: "200px" },
    value: { type: String },
    showBtn: { type: Boolean, default: true },
    btnProps: { type: Object },
    btnText: { type: String, default: "" },
    uploadApi: {
        type: Function
    }
};
const _sfc_main$f = vue.defineComponent({
    name: "CropperAvatar",
    components: { CopperModal, Icon: Icon2 },
    props: props$1,
    emits: ["update:value", "change", "beforeUpload"],
    setup(props2, { emit, expose }) {
        const sourceValue = vue.ref(props2.value || "");
        const prefixCls2 = "shy-cropper-avatar";
        const [register, { openModal, closeModal }] = useModal();
        const { createMessage } = use.useMessage();
        const getClass = vue.computed(() => [prefixCls2]);
        const getWidth = vue.computed(() => `${props2.width}`.replace(/px/, "") + "px");
        const getIconWidth = vue.computed(
            () => parseInt(`${props2.width}`.replace(/px/, "")) / 2 + "px"
        );
        const getStyle = vue.computed(() => ({ width: vue.unref(getWidth) }));
        const getImageWrapperStyle = vue.computed(
            () => ({ width: vue.unref(getWidth), height: vue.unref(getWidth) })
        );
        vue.watchEffect(() => {
            sourceValue.value = props2.value || "";
        });
        vue.watch(
            () => sourceValue.value,
            (v) => {
                emit("update:value", v);
            }
        );
        function handleUploadSuccess({ source, data }) {
            sourceValue.value = source;
            emit("change", { source, data });
            createMessage.success("上传成功");
        }
        function handleBeforeUpload({ file, closeModal: closeModal2, filename }) {
            emit("beforeUpload", { file, closeModal: closeModal2, filename });
        }
        expose({ openModal: openModal.bind(null, true), closeModal });
        return {
            prefixCls: prefixCls2,
            register,
            openModal,
            getIconWidth,
            sourceValue,
            getClass,
            getImageWrapperStyle,
            getStyle,
            handleUploadSuccess,
            handleBeforeUpload
        };
    }
});
const CropperAvatar_vue_vue_type_style_index_0_scoped_31315934_lang = "";
const _hoisted_1$7 = ["src"];
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_a_button = vue.resolveComponent("a-button");
    const _component_CopperModal = vue.resolveComponent("CopperModal");
    return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(_ctx.getClass),
        style: vue.normalizeStyle(_ctx.getStyle)
    }, [
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-image-wrapper`),
            style: vue.normalizeStyle(_ctx.getImageWrapperStyle),
            onClick: _cache[0] || (_cache[0] = ($event) => _ctx.openModal(true, {}))
        }, [
            vue.createElementVNode("div", {
                class: vue.normalizeClass(`${_ctx.prefixCls}-image-mask`),
                style: vue.normalizeStyle(_ctx.getImageWrapperStyle)
            }, [
                vue.createVNode(_component_Icon, {
                    icon: "ant-design:cloud-upload-outlined",
                    size: _ctx.getIconWidth,
                    style: vue.normalizeStyle(_ctx.getImageWrapperStyle),
                    color: "#d6d6d6"
                }, null, 8, ["size", "style"])
            ], 6),
            _ctx.sourceValue ? (vue.openBlock(), vue.createElementBlock("img", {
                key: 0,
                src: _ctx.sourceValue,
                alt: "avatar"
            }, null, 8, _hoisted_1$7)) : vue.createCommentVNode("", true)
        ], 6),
        _ctx.showBtn ? (vue.openBlock(), vue.createBlock(_component_a_button, vue.mergeProps({
            key: 0,
            class: `${_ctx.prefixCls}-upload-btn`,
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.openModal(true, {}))
        }, _ctx.btnProps), {
            default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(_ctx.btnText ? _ctx.btnText : "选择图片"), 1)
            ]),
            _: 1
        }, 16, ["class"])) : vue.createCommentVNode("", true),
        vue.createVNode(_component_CopperModal, {
            onRegister: _ctx.register,
            onUploadSuccess: _ctx.handleUploadSuccess,
            onBeforeUpload: _ctx.handleBeforeUpload,
            uploadApi: _ctx.uploadApi,
            src: _ctx.sourceValue
        }, null, 8, ["onRegister", "onUploadSuccess", "onBeforeUpload", "uploadApi", "src"])
    ], 6);
}
const CropperAvatar = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$a], ["__scopeId", "data-v-31315934"]]);
const props = {
    startVal: { type: Number, default: 0 },
    endVal: { type: Number, default: 2021 },
    duration: { type: Number, default: 1500 },
    autoplay: { type: Boolean, default: true },
    decimals: {
        type: Number,
        default: 0,
        validator(value) {
            return value >= 0;
        }
    },
    prefix: { type: String, default: "" },
    suffix: { type: String, default: "" },
    separator: { type: String, default: "," },
    decimal: { type: String, default: "." },
    /**
     * font color
     */
    color: { type: String },
    /**
     * Turn on digital animation
     */
    useEasing: { type: Boolean, default: true },
    /**
     * Digital animation
     */
    transition: { type: String, default: "linear" }
};
const _sfc_main$e = vue.defineComponent({
    name: "CountTo",
    props,
    emits: ["onStarted", "onFinished"],
    setup(props2, { emit }) {
        const source = vue.ref(props2.startVal);
        const disabled = vue.ref(false);
        let outputValue = useTransition(source);
        const value = vue.computed(() => formatNumber(vue.unref(outputValue)));
        vue.watchEffect(() => {
            source.value = props2.startVal;
        });
        vue.watch([() => props2.startVal, () => props2.endVal], () => {
            if (props2.autoplay) {
                start();
            }
        });
        vue.onMounted(() => {
            props2.autoplay && start();
        });
        function start() {
            run();
            source.value = props2.endVal;
        }
        function reset2() {
            source.value = props2.startVal;
            run();
        }
        function run() {
            outputValue = useTransition(source, {
                disabled,
                duration: props2.duration,
                onFinished: () => emit("onFinished"),
                onStarted: () => emit("onStarted"),
                ...props2.useEasing ? { transition: TransitionPresets[props2.transition] } : {}
            });
        }
        function formatNumber(num) {
            if (!num && num !== 0) {
                return "";
            }
            const { decimals, decimal, separator, suffix, prefix } = props2;
            num = Number(num).toFixed(decimals);
            num += "";
            const x = num.split(".");
            let x1 = x[0];
            const x2 = x.length > 1 ? decimal + x[1] : "";
            const rgx = /(\d+)(\d{3})/;
            if (separator && !utils.isNumber(separator)) {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, "$1" + separator + "$2");
                }
            }
            return prefix + x1 + x2 + suffix;
        }
        return { value, start, reset: reset2 };
    }
});
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("span", {
        style: vue.normalizeStyle({ color: _ctx.color })
    }, vue.toDisplayString(_ctx.value), 5);
}
const CountTo = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$9]]);
const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "ClickOutSide",
    emits: ["mounted", "clickOutside"],
    setup(__props, { emit }) {
        const wrap = vue.ref(null);
        onClickOutside(wrap, () => {
            emit("clickOutside");
        });
        vue.onMounted(() => {
            emit("mounted");
        });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
                ref_key: "wrap",
                ref: wrap
            }, [
                vue.renderSlot(_ctx.$slots, "default")
            ], 512);
        };
    }
});
var SizeEnum = /* @__PURE__ */ ((SizeEnum2) => {
    SizeEnum2["DEFAULT"] = "default";
    SizeEnum2["SMALL"] = "small";
    SizeEnum2["LARGE"] = "large";
    return SizeEnum2;
})(SizeEnum || {});
(() => {
    const map = /* @__PURE__ */ new Map();
    map.set(
        "default",
        48
        /* DEFAULT */
    );
    map.set(
        "small",
        16
        /* SMALL */
    );
    map.set(
        "large",
        64
        /* LARGE */
    );
    return map;
})();
const _sfc_main$c = vue.defineComponent({
    name: "Loading",
    components: { Spin: antDesignVue.Spin },
    props: {
        tip: {
            type: String,
            default: ""
        },
        size: {
            type: String,
            default: SizeEnum.LARGE,
            validator: (v) => {
                return [SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE].includes(v);
            }
        },
        absolute: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        background: {
            type: String
        },
        theme: {
            type: String
        }
    }
});
const Loading_vue_vue_type_style_index_0_scoped_ee545744_lang = "";
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Spin = vue.resolveComponent("Spin");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("section", {
        class: vue.normalizeClass(["full-loading", { absolute: _ctx.absolute, [_ctx.theme]: !!_ctx.theme }]),
        style: vue.normalizeStyle([_ctx.background ? `background-color: ${_ctx.background}` : ""])
    }, [
        vue.createVNode(_component_Spin, vue.mergeProps(_ctx.$attrs, {
            tip: _ctx.tip,
            size: _ctx.size,
            spinning: _ctx.loading
        }), null, 16, ["tip", "size", "spinning"])
    ], 6)), [
        [vue.vShow, _ctx.loading]
    ]);
}
const Loading = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$8], ["__scopeId", "data-v-ee545744"]]);
function createLoading(props2, target, wait = false) {
    let vm = null;
    const data = vue.reactive({
        tip: "",
        loading: true,
        ...props2
    });
    const LoadingWrap = vue.defineComponent({
        render() {
            return vue.h(Loading, { ...data });
        }
    });
    vm = vue.createVNode(LoadingWrap);
    if (wait) {
        setTimeout(() => {
            vue.render(vm, document.createElement("div"));
        }, 0);
    } else {
        vue.render(vm, document.createElement("div"));
    }
    function close() {
        if ((vm == null ? void 0 : vm.el) && vm.el.parentNode) {
            vm.el.parentNode.removeChild(vm.el);
        }
    }
    function open(target2 = document.body) {
        if (!vm || !vm.el) {
            return;
        }
        target2.appendChild(vm.el);
    }
    if (target) {
        open(target);
    }
    return {
        vm,
        close,
        open,
        setTip: (tip) => {
            data.tip = tip;
        },
        setLoading: (loading) => {
            data.loading = loading;
        },
        get loading() {
            return data.loading;
        },
        get $el() {
            return vm == null ? void 0 : vm.el;
        }
    };
}
function useLoading(opt) {
    let props2;
    let target = document.body;
    if (Reflect.has(opt, "target") || Reflect.has(opt, "props")) {
        const options = opt;
        props2 = options.props || {};
        target = options.target || document.body;
    } else {
        props2 = opt;
    }
    const instance = createLoading(props2, void 0, true);
    const open = () => {
        const t2 = vue.unref(target);
        if (!t2)
            return;
        instance.open(t2);
    };
    const close = () => {
        instance.close();
    };
    const setTip = (tip) => {
        instance.setTip(tip);
    };
    return [open, close, setTip];
}
const index$1 = "";
const style = "";
const basicProps = {
    border: false,
    size: "mini",
    align: "left",
    // 行设置
    rowConfig: {
        isHover: true,
        height: 40
    },
    // 序号设置
    seqConfig: {},
    // 高度
    height: "auto",
    // autoResize: true
    headerCellStyle: {
        backgroundColor: "#fafafa",
        color: "rgba(0, 0, 0, 0.85)",
        fontFamily: "Arial, PuHuiTi !important",
        fontWeight: 700,
        fontSize: "12px",
        fontFeatureSetting: "tnum"
    },
    sortConfig: {
        showIcon: false
    }
};
const basicColumn = {
    showHeaderOverflow: "tooltip",
    showOverflow: "tooltip",
    align: "left",
    visible: true,
    sortable: false
};
const usePagination = () => {
    const page = vue.reactive({
        total: 0,
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30", "40"]
    });
    const setPage = (pageInfo) => {
        vue.nextTick(() => {
            Object.keys(pageInfo).forEach((key2) => {
                page[key2] = pageInfo[key2];
            });
        });
    };
    return { page, setPage };
};
const useTableData = (getProps, { setPage, params, tableRef }) => {
    const dataSource = vue.ref([]);
    const setTableData = (data) => {
        dataSource.value = data.map((item) => {
            item._isEdit = false;
            return item;
        });
    };
    const getTableData = () => {
        return dataSource.value;
    };
    const reload = async () => {
        var _a2;
        if ((_a2 = getProps.value) == null ? void 0 : _a2.api) {
            const res = await getProps.value.api(params.value);
            setTableData(getProps.value.transDataAfterReload(res));
            setPage({ total: (res == null ? void 0 : res.total) || 0 });
        }
    };
    const addTableData = (list = [{}]) => {
        const temp = list.map((item) => {
            item._isEdit = true;
            return item;
        });
        dataSource.value.unshift(...temp);
        tableRef.value.loadData(dataSource.value);
    };
    vue.onMounted(async () => {
        if (getProps.value.isImmediate) {
            await reload();
        }
    });
    return {
        dataSource,
        setTableData,
        reload,
        getTableData,
        addTableData
    };
};
const componentMap = /* @__PURE__ */ new Map();
componentMap.set("Input", antDesignVue.Input);
componentMap.set("InputNumber", antDesignVue.InputNumber);
componentMap.set("Select", antDesignVue.Select);
componentMap.set("ApiSelect", ApiSelect);
componentMap.set("AutoComplete", antDesignVue.AutoComplete);
componentMap.set("ApiTreeSelect", ApiTreeSelect);
componentMap.set("Switch", antDesignVue.Switch);
componentMap.set("Checkbox", antDesignVue.Checkbox);
componentMap.set("DatePicker", antDesignVue.DatePicker);
componentMap.set("TimePicker", antDesignVue.TimePicker);
componentMap.set("RadioGroup", antDesignVue.Radio.Group);
componentMap.set("RadioButtonGroup", RadioButtonGroup);
componentMap.set("ApiRadioGroup", ApiRadioGroup);
const CellComponent = ({
                           component = "Input",
                           rule = true,
                           ruleMessage = "",
                           popoverVisible = false,
                           getPopupContainer: getPopupContainer2
                       }, { attrs }) => {
    const Comp = componentMap.get(component);
    const DefaultComp = vue.h(Comp, { style: { width: "100%" }, ...attrs });
    if (!rule) {
        return DefaultComp;
    }
    return vue.h(
        antDesignVue.Popover,
        {
            overlayClassName: "edit-cell-rule-popover",
            visible: !!popoverVisible,
            ...getPopupContainer2 ? { getPopupContainer: getPopupContainer2 } : {}
        },
        {
            default: () => DefaultComp,
            content: () => ruleMessage
        }
    );
};
const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "ButtonGroupEdit",
    props: {
        row: {
            default: null
        }
    },
    emits: [
        "updateStatusEdit",
        "edit-ensure",
        "edit-cancel",
        "row-remove"
    ],
    setup(__props, { emit }) {
        const props2 = __props;
        const getActions = vue.computed(() => {
            var _a2;
            return [
                {
                    label: "编辑",
                    onClick: () => {
                        emit("updateStatusEdit", true);
                    },
                    ifShow: ((_a2 = props2 == null ? void 0 : props2.row) == null ? void 0 : _a2._isEdit) === false
                },
                {
                    label: "删除",
                    popConfirm: {
                        title: "是否确认删除",
                        confirm: () => {
                            emit("row-remove", true);
                        }
                    },
                    ifShow: props2.row._isEdit === false
                },
                {
                    label: "确定",
                    onClick: () => {
                        emit("updateStatusEdit", false);
                        emit("edit-ensure");
                    },
                    ifShow: props2.row._isEdit === true
                },
                {
                    label: "取消",
                    onClick: () => {
                        emit("updateStatusEdit", false);
                        emit("edit-cancel");
                    },
                    ifShow: props2.row._isEdit === true
                }
            ];
        });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(_sfc_main$V, {
                actions: vue.unref(getActions),
                "show-count": 4,
                outside: true
            }, null, 8, ["actions"]);
        };
    }
});
const _hoisted_1$6 = { style: { "overflow": "hidden" } };
const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "Sort",
    emits: ["change"],
    setup(__props, { emit: emits }) {
        const basStyle = {
            display: "block",
            color: "#bfbfbf",
            fontSize: "12px"
        };
        const curPicker = vue.ref(0);
        const handleUpClick = () => {
            curPicker.value === 1 ? curPicker.value = 0 : curPicker.value = 1;
        };
        const handleDownClick = () => {
            curPicker.value === 2 ? curPicker.value = 0 : curPicker.value = 2;
        };
        vue.watch(curPicker, (value) => {
            emits("change", value);
        });
        const getStyleUp = vue.computed(() => {
            return {
                ...basStyle,
                transform: "transLateY(2px)",
                color: curPicker.value === 1 ? "#4B8FF9" : "#bfbfbf"
            };
        });
        const getStyleDown = vue.computed(() => {
            return {
                ...basStyle,
                transform: "transLateY(-2px)",
                color: curPicker.value === 2 ? "#4B8FF9" : "#bfbfbf"
            };
        });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
                vue.createVNode(vue.unref(CaretUpOutlined$1), {
                    style: vue.normalizeStyle(vue.unref(getStyleUp)),
                    onClick: handleUpClick
                }, null, 8, ["style"]),
                vue.createVNode(vue.unref(CaretDownOutlined$1), {
                    style: vue.normalizeStyle(vue.unref(getStyleDown)),
                    onClick: handleDownClick
                }, null, 8, ["style"])
            ]);
        };
    }
});
const _hoisted_1$5 = { key: 0 };
const _hoisted_2$1 = { key: 1 };
const _hoisted_3$1 = { key: 2 };
const _hoisted_4$1 = { style: { "display": "flex", "justify-content": "space-between" } };
const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "TableColGroup",
    props: {
        column: null
    },
    emits: ["handleSortChange"],
    setup(__props, { emit: emits }) {
        const getSwitchShowText = (column, row) => {
            const {
                unCheckedChildren = "否",
                unCheckedValue = 0,
                checkedChildren = "是",
                checkedValue = 1
            } = (column == null ? void 0 : column.editComponentProps) || {};
            if (row[column.field] == checkedValue) {
                return checkedChildren;
            } else if (row[column.field] == unCheckedValue) {
                return unCheckedChildren;
            } else {
                return "";
            }
        };
        const handleSortChange = (field, type) => {
            emits("handleSortChange", { field, type });
        };
        return (_ctx, _cache) => {
            const _component_TableColGroup = vue.resolveComponent("TableColGroup", true);
            return vue.openBlock(), vue.createBlock(vue.unref(vxeTable.VxeColgroup), vue.mergeProps({
                title: __props.column.groupName
            }, __props.column), {
                default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.column.children, (c) => {
                        return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                            key: c.field
                        }, [
                            (c == null ? void 0 : c.groupName) ? (vue.openBlock(), vue.createBlock(_component_TableColGroup, {
                                key: 0,
                                column: c,
                                onHandleSortChange: handleSortChange
                            }, null, 8, ["column"])) : (vue.openBlock(), vue.createBlock(vue.unref(vxeTable.VxeColumn), vue.mergeProps({ key: 1 }, c, {
                                "edit-render": (c == null ? void 0 : c.editRender) || void 0
                            }), {
                                default: vue.withCtx((config) => [
                                    vue.renderSlot(_ctx.$slots, c.field, vue.normalizeProps(vue.guardReactiveProps(config)), () => {
                                        var _a2, _b, _c, _d, _e;
                                        return [
                                            config.row._isEdit && ((_a2 = __props.column) == null ? void 0 : _a2.isEdit) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                                                ((_b = c == null ? void 0 : c.editComponentProps) == null ? void 0 : _b.component) === "Switch" ? (vue.openBlock(), vue.createBlock(vue.unref(CellComponent), vue.mergeProps({
                                                    key: 0,
                                                    checkedValue: 1,
                                                    unCheckedValue: 0
                                                }, (c == null ? void 0 : c.editComponentProps) || {}, {
                                                    checked: config.row[c.field],
                                                    "onUpdate:checked": ($event) => config.row[c.field] = $event
                                                }), null, 16, ["checked", "onUpdate:checked"])) : (vue.openBlock(), vue.createBlock(vue.unref(CellComponent), vue.mergeProps({ key: 1 }, (c == null ? void 0 : c.editComponentProps) || {}, {
                                                    value: config.row[c.field],
                                                    "onUpdate:value": ($event) => config.row[c.field] = $event
                                                }), null, 16, ["value", "onUpdate:value"]))
                                            ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                                                (c == null ? void 0 : c.isEdit) && ((_c = c == null ? void 0 : c.editComponentProps) == null ? void 0 : _c.component) === "Select" || ((_d = c == null ? void 0 : c.editComponentProps) == null ? void 0 : _d.component) === "ApiSelect" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$5, [
                                                    vue.createVNode(vue.unref(CellComponent), vue.mergeProps((c == null ? void 0 : c.editComponentProps) || {}, {
                                                        value: config.row[c.field],
                                                        "onUpdate:value": ($event) => config.row[c.field] = $event,
                                                        bordered: false,
                                                        showArrow: false,
                                                        open: false,
                                                        popoverVisible: false
                                                    }), null, 16, ["value", "onUpdate:value"])
                                                ])) : (c == null ? void 0 : c.isEdit) && ((_e = c == null ? void 0 : c.editComponentProps) == null ? void 0 : _e.component) === "Switch" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$1, [
                                                    vue.createElementVNode("span", null, vue.toDisplayString(getSwitchShowText(c, config.row)), 1)
                                                ])) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_3$1, vue.toDisplayString(config.row[c.field]), 1))
                                            ], 64))
                                        ];
                                    })
                                ]),
                                header: vue.withCtx(() => [
                                    vue.renderSlot(_ctx.$slots, `${c.field}Header`, vue.normalizeProps(vue.guardReactiveProps({ c })), () => {
                                        var _a2;
                                        return [
                                            vue.createElementVNode("div", _hoisted_4$1, [
                                                vue.createElementVNode("div", null, vue.toDisplayString(c.title), 1),
                                                ((_a2 = __props.column) == null ? void 0 : _a2.sortable) ? (vue.openBlock(), vue.createBlock(_sfc_main$a, {
                                                    key: 0,
                                                    onChange: _cache[0] || (_cache[0] = (type) => handleSortChange(__props.column.field, type))
                                                })) : vue.createCommentVNode("", true)
                                            ])
                                        ];
                                    })
                                ]),
                                _: 2
                            }, 1040, ["edit-render"]))
                        ], 64);
                    }), 128))
                ]),
                _: 3
            }, 16, ["title"]);
        };
    }
});
const _sfc_main$8 = vue.defineComponent({
    name: "ColumnSetting",
    components: {
        SettingOutlined: SettingOutlined$1,
        Popover: antDesignVue.Popover,
        Tooltip: antDesignVue.Tooltip,
        Checkbox: antDesignVue.Checkbox,
        CheckboxGroup: antDesignVue.Checkbox.Group,
        DragOutlined: DragOutlined$1,
        ScrollContainer: ScrollContainer$1,
        Divider: antDesignVue.Divider,
        Icon: Icon2
    },
    emits: ["columns-change"],
    setup() {
        const table2 = useTableContext();
        const defaultRowSelection = [];
        const cachePlainOptions = vue.ref([]);
        const plainOptions = vue.ref([]);
        const plainSortOptions = vue.ref([]);
        plainOptions.value = cloneDeep(getColumns());
        cachePlainOptions.value = cloneDeep(getColumns());
        plainSortOptions.value = cloneDeep(getColumns());
        const columnListRef = vue.ref(null);
        const state = vue.reactive({
            checkAll: true,
            checkedList: [],
            defaultCheckList: []
        });
        const checkIndex = vue.ref(false);
        const checkSelect = vue.ref(false);
        vue.onMounted(() => {
            init();
        });
        const { prefixCls: prefixCls2 } = use.useDesign("basic-column-setting");
        function getColumns() {
            return table2.getColumns();
        }
        function init() {
            checkIndex.value = table2.getProps.value.isShowSeq;
            checkSelect.value = table2.getProps.value.isShowRowSelection;
            state.checkedList = getColumns().map((column) => {
                return column.field;
            });
        }
        const inited = vue.ref(false);
        const handleVisibleChange = () => {
            vue.nextTick(() => {
                const columnListEl = vue.unref(columnListRef);
                if (!columnListEl)
                    return;
                const el = columnListEl.$el;
                if (!el)
                    return;
                sortable = Sortablejs.create(vue.unref(el), {
                    animation: 500,
                    delay: 400,
                    delayOnTouchOnly: true,
                    handle: ".table-column-drag-icon ",
                    onEnd: (evt) => {
                        const { oldIndex, newIndex } = evt;
                        if (utils.isNullAndUnDef(oldIndex) || utils.isNullAndUnDef(newIndex) || oldIndex === newIndex) {
                            return;
                        }
                        const columns = cloneDeep(plainSortOptions.value);
                        if (oldIndex > newIndex) {
                            columns.splice(newIndex, 0, columns[oldIndex]);
                            columns.splice(oldIndex + 1, 1);
                        } else {
                            columns.splice(newIndex + 1, 0, columns[oldIndex]);
                            columns.splice(oldIndex, 1);
                        }
                        plainSortOptions.value = columns;
                        table2.setProps({ columns });
                        vue.nextTick(() => {
                            table2.refreshColumn();
                        });
                    }
                });
                sortableOrder = sortable.toArray();
                inited.value = true;
            });
        };
        function onCheckAllChange(e) {
            const checkList = plainOptions.value.map((item) => item.field);
            if (e.target.checked) {
                state.checkedList = checkList;
                table2.showColumn(checkList);
            } else {
                state.checkedList = [];
                table2.hideColumn(checkList);
            }
        }
        vue.watch(
            () => state.checkedList,
            (value) => {
                plainSortOptions.value.forEach((column) => {
                    if (value.includes(column.field)) {
                        column.visible = true;
                    } else {
                        column.visible = false;
                    }
                });
                table2.setProps({ columns: plainSortOptions.value });
                vue.nextTick(() => {
                    table2.refreshColumn();
                });
            }
        );
        let sortable;
        let sortableOrder = [];
        function reset2() {
            sortable.sort(sortableOrder);
            plainOptions.value = JSON.parse(JSON.stringify(cachePlainOptions.value));
            plainSortOptions.value = JSON.parse(
                JSON.stringify(cachePlainOptions.value)
            );
            state.checkAll = true;
            state.checkedList = cachePlainOptions.value.map((column) => column.field);
            table2.setProps({ columns: cachePlainOptions.value });
            vue.nextTick(() => {
                table2.refreshColumn();
            });
        }
        function handleIndexCheckChange(e) {
            table2.setProps({
                isShowSeq: e.target.checked
            });
        }
        function handleSelectCheckChange(e) {
            table2.setProps({
                isShowRowSelection: e.target.checked ? defaultRowSelection : void 0
            });
        }
        function handleColumnFixed(item, fixed) {
            if (!state.checkedList.includes(item.field))
                return;
            const columns = JSON.parse(JSON.stringify(plainSortOptions.value));
            const isFixed = item.fixed === fixed ? false : fixed;
            const index2 = columns.findIndex((col) => col.field === item.field);
            if (index2 !== -1) {
                columns[index2].fixed = isFixed;
            }
            item.fixed = isFixed;
            if (isFixed && !item.width) {
                item.width = 100;
            }
            plainSortOptions.value = columns;
            table2.setProps({ columns });
            vue.nextTick(() => {
                table2.refreshColumn();
            });
        }
        function getPopupContainer2() {
            return document.body;
        }
        return {
            ...vue.toRefs(state),
            onCheckAllChange,
            plainOptions,
            reset: reset2,
            prefixCls: prefixCls2,
            columnListRef,
            checkIndex,
            checkSelect,
            handleIndexCheckChange,
            handleSelectCheckChange,
            defaultRowSelection,
            handleColumnFixed,
            getPopupContainer: getPopupContainer2,
            handleVisibleChange
        };
    }
});
const ColumnSetting_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$4 = /* @__PURE__ */ vue.createElementVNode("span", null, "列展示", -1);
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Checkbox = vue.resolveComponent("Checkbox");
    const _component_a_button = vue.resolveComponent("a-button");
    const _component_DragOutlined = vue.resolveComponent("DragOutlined");
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    const _component_Divider = vue.resolveComponent("Divider");
    const _component_CheckboxGroup = vue.resolveComponent("CheckboxGroup");
    const _component_ScrollContainer = vue.resolveComponent("ScrollContainer");
    const _component_SettingOutlined = vue.resolveComponent("SettingOutlined");
    const _component_Popover = vue.resolveComponent("Popover");
    return vue.openBlock(), vue.createBlock(_component_Tooltip, { placement: "top" }, {
        title: vue.withCtx(() => [
            _hoisted_1$4
        ]),
        default: vue.withCtx(() => [
            vue.createVNode(_component_Popover, {
                placement: "bottomLeft",
                trigger: "click",
                overlayClassName: `${_ctx.prefixCls}__cloumn-list`,
                onVisibleChange: _ctx.handleVisibleChange
            }, {
                title: vue.withCtx(() => [
                    vue.createElementVNode("div", {
                        class: vue.normalizeClass(`${_ctx.prefixCls}__popover-title`)
                    }, [
                        vue.createVNode(_component_Checkbox, {
                            checked: _ctx.checkAll,
                            "onUpdate:checked": _cache[0] || (_cache[0] = ($event) => _ctx.checkAll = $event),
                            onChange: _ctx.onCheckAllChange
                        }, {
                            default: vue.withCtx(() => [
                                vue.createTextVNode(" 列展示 ")
                            ]),
                            _: 1
                        }, 8, ["checked", "onChange"]),
                        vue.createVNode(_component_Checkbox, {
                            checked: _ctx.checkIndex,
                            "onUpdate:checked": _cache[1] || (_cache[1] = ($event) => _ctx.checkIndex = $event),
                            onChange: _ctx.handleIndexCheckChange
                        }, {
                            default: vue.withCtx(() => [
                                vue.createTextVNode(" 序号列 ")
                            ]),
                            _: 1
                        }, 8, ["checked", "onChange"]),
                        vue.createVNode(_component_Checkbox, {
                            checked: _ctx.checkSelect,
                            "onUpdate:checked": _cache[2] || (_cache[2] = ($event) => _ctx.checkSelect = $event),
                            onChange: _ctx.handleSelectCheckChange,
                            disabled: !_ctx.defaultRowSelection
                        }, {
                            default: vue.withCtx(() => [
                                vue.createTextVNode(" 勾选列 ")
                            ]),
                            _: 1
                        }, 8, ["checked", "onChange", "disabled"]),
                        vue.createVNode(_component_a_button, {
                            size: "small",
                            type: "link",
                            onClick: _ctx.reset
                        }, {
                            default: vue.withCtx(() => [
                                vue.createTextVNode(" 重置 ")
                            ]),
                            _: 1
                        }, 8, ["onClick"])
                    ], 2)
                ]),
                content: vue.withCtx(() => [
                    vue.createVNode(_component_ScrollContainer, null, {
                        default: vue.withCtx(() => [
                            vue.createVNode(_component_CheckboxGroup, {
                                value: _ctx.checkedList,
                                "onUpdate:value": _cache[3] || (_cache[3] = ($event) => _ctx.checkedList = $event),
                                ref: "columnListRef"
                            }, {
                                default: vue.withCtx(() => [
                                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.plainOptions, (item) => {
                                        return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                                            key: item.value
                                        }, [
                                            !("ifShow" in item && !item.ifShow) ? (vue.openBlock(), vue.createElementBlock("div", {
                                                key: 0,
                                                class: vue.normalizeClass(`${_ctx.prefixCls}__check-item`)
                                            }, [
                                                vue.createVNode(_component_DragOutlined, { class: "table-column-drag-icon" }),
                                                vue.createVNode(_component_Checkbox, {
                                                    value: item.field
                                                }, {
                                                    default: vue.withCtx(() => [
                                                        vue.createTextVNode(vue.toDisplayString(item.title), 1)
                                                    ]),
                                                    _: 2
                                                }, 1032, ["value"]),
                                                vue.createVNode(_component_Tooltip, {
                                                    placement: "bottomLeft",
                                                    mouseLeaveDelay: 0.4,
                                                    getPopupContainer: _ctx.getPopupContainer
                                                }, {
                                                    title: vue.withCtx(() => [
                                                        vue.createTextVNode(" 固定到左侧 ")
                                                    ]),
                                                    default: vue.withCtx(() => [
                                                        vue.createVNode(_component_Icon, {
                                                            icon: "line-md:arrow-align-left",
                                                            class: vue.normalizeClass([
                                                                `${_ctx.prefixCls}__fixed-left`,
                                                                {
                                                                    active: item.fixed === "left",
                                                                    disabled: !_ctx.checkedList.includes(item.field)
                                                                }
                                                            ]),
                                                            onClick: ($event) => _ctx.handleColumnFixed(item, "left")
                                                        }, null, 8, ["class", "onClick"])
                                                    ]),
                                                    _: 2
                                                }, 1032, ["mouseLeaveDelay", "getPopupContainer"]),
                                                vue.createVNode(_component_Divider, { type: "vertical" }),
                                                vue.createVNode(_component_Tooltip, {
                                                    placement: "bottomLeft",
                                                    mouseLeaveDelay: 0.4,
                                                    getPopupContainer: _ctx.getPopupContainer
                                                }, {
                                                    title: vue.withCtx(() => [
                                                        vue.createTextVNode(" 固定到右侧 ")
                                                    ]),
                                                    default: vue.withCtx(() => [
                                                        vue.createVNode(_component_Icon, {
                                                            icon: "line-md:arrow-align-left",
                                                            class: vue.normalizeClass([
                                                                `${_ctx.prefixCls}__fixed-right`,
                                                                {
                                                                    active: item.fixed === "right",
                                                                    disabled: !_ctx.checkedList.includes(item.field)
                                                                }
                                                            ]),
                                                            onClick: ($event) => _ctx.handleColumnFixed(item, "right")
                                                        }, null, 8, ["class", "onClick"])
                                                    ]),
                                                    _: 2
                                                }, 1032, ["mouseLeaveDelay", "getPopupContainer"])
                                            ], 2)) : vue.createCommentVNode("", true)
                                        ], 64);
                                    }), 128))
                                ]),
                                _: 1
                            }, 8, ["value"])
                        ]),
                        _: 1
                    })
                ]),
                default: vue.withCtx(() => [
                    vue.createVNode(_component_SettingOutlined)
                ]),
                _: 1
            }, 8, ["overlayClassName", "onVisibleChange"])
        ]),
        _: 1
    });
}
const ColumnSetting = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7]]);
const _sfc_main$7 = vue.defineComponent({
    name: "SizeSetting",
    components: {
        ColumnHeightOutlined: ColumnHeightOutlined$1,
        Tooltip: antDesignVue.Tooltip,
        Dropdown: antDesignVue.Dropdown,
        Menu: antDesignVue.Menu,
        MenuItem: antDesignVue.Menu.Item
    },
    setup() {
        const table2 = useTableContext();
        const { t: t2 } = use.useI18n();
        const selectedKeysRef = vue.ref([table2.getSize()]);
        function handleTitleClick({ key: key2 }) {
            selectedKeysRef.value = [key2];
            table2.setProps({
                size: key2
            });
        }
        return {
            handleTitleClick,
            selectedKeysRef,
            getPopupContainer: utils.getPopupContainer,
            t: t2
        };
    }
});
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ColumnHeightOutlined = vue.resolveComponent("ColumnHeightOutlined");
    const _component_MenuItem = vue.resolveComponent("MenuItem");
    const _component_Menu = vue.resolveComponent("Menu");
    const _component_Dropdown = vue.resolveComponent("Dropdown");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    return vue.openBlock(), vue.createBlock(_component_Tooltip, { placement: "top" }, {
        title: vue.withCtx(() => [
            vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingDens")), 1)
        ]),
        default: vue.withCtx(() => [
            vue.createVNode(_component_Dropdown, {
                placement: "bottom",
                trigger: ["click"],
                getPopupContainer: _ctx.getPopupContainer
            }, {
                overlay: vue.withCtx(() => [
                    vue.createVNode(_component_Menu, {
                        onClick: _ctx.handleTitleClick,
                        selectable: "",
                        selectedKeys: _ctx.selectedKeysRef,
                        "onUpdate:selectedKeys": _cache[0] || (_cache[0] = ($event) => _ctx.selectedKeysRef = $event)
                    }, {
                        default: vue.withCtx(() => [
                            vue.createVNode(_component_MenuItem, { key: "default" }, {
                                default: vue.withCtx(() => [
                                    vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingDensDefault")), 1)
                                ]),
                                _: 1
                            }),
                            vue.createVNode(_component_MenuItem, { key: "middle" }, {
                                default: vue.withCtx(() => [
                                    vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingDensMiddle")), 1)
                                ]),
                                _: 1
                            }),
                            vue.createVNode(_component_MenuItem, { key: "small" }, {
                                default: vue.withCtx(() => [
                                    vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingDensSmall")), 1)
                                ]),
                                _: 1
                            })
                        ]),
                        _: 1
                    }, 8, ["onClick", "selectedKeys"])
                ]),
                default: vue.withCtx(() => [
                    vue.createVNode(_component_ColumnHeightOutlined)
                ]),
                _: 1
            }, 8, ["getPopupContainer"])
        ]),
        _: 1
    });
}
const SizeSetting = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6]]);
const _sfc_main$6 = vue.defineComponent({
    name: "FullScreenSetting",
    components: {
        FullscreenExitOutlined: FullscreenExitOutlined$1,
        FullscreenOutlined: FullscreenOutlined$1,
        Tooltip: antDesignVue.Tooltip
    },
    setup() {
        const table2 = useTableContext();
        const { t: t2 } = use.useI18n();
        const { toggle, isFullscreen } = useFullscreen(table2.wrapRef);
        return {
            toggle,
            isFullscreen,
            t: t2
        };
    }
});
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FullscreenOutlined = vue.resolveComponent("FullscreenOutlined");
    const _component_FullscreenExitOutlined = vue.resolveComponent("FullscreenExitOutlined");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    return vue.openBlock(), vue.createBlock(_component_Tooltip, { placement: "top" }, {
        title: vue.withCtx(() => [
            vue.createElementVNode("span", null, vue.toDisplayString(_ctx.t("component.table.settingFullScreen")), 1)
        ]),
        default: vue.withCtx(() => [
            !_ctx.isFullscreen ? (vue.openBlock(), vue.createBlock(_component_FullscreenOutlined, {
                key: 0,
                onClick: _ctx.toggle
            }, null, 8, ["onClick"])) : (vue.openBlock(), vue.createBlock(_component_FullscreenExitOutlined, {
                key: 1,
                onClick: _ctx.toggle
            }, null, 8, ["onClick"]))
        ]),
        _: 1
    });
}
const FullScreenSetting = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5]]);
const _sfc_main$5 = vue.defineComponent({
    name: "RedoSetting",
    components: {
        BarsOutlined: BarsOutlined$1,
        Tooltip: antDesignVue.Tooltip
    },
    setup() {
        const table2 = useTableContext();
        const { t: t2 } = use.useI18n();
        function redo() {
            const isShowSearch = vue.unref(table2.getBindValues).isShowSearch;
            table2.setProps({ isShowSearch: !isShowSearch });
        }
        return { redo, t: t2 };
    }
});
const _hoisted_1$3 = /* @__PURE__ */ vue.createElementVNode("span", null, "显隐搜索", -1);
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BarsOutlined = vue.resolveComponent("BarsOutlined");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    return vue.openBlock(), vue.createBlock(_component_Tooltip, { placement: "top" }, {
        title: vue.withCtx(() => [
            _hoisted_1$3
        ]),
        default: vue.withCtx(() => [
            vue.createVNode(_component_BarsOutlined, { onClick: _ctx.redo }, null, 8, ["onClick"])
        ]),
        _: 1
    });
}
const ShowSearchSetting = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4]]);
const _sfc_main$4 = vue.defineComponent({
    name: "TableSetting",
    components: {
        ColumnSetting,
        SizeSetting,
        FullScreenSetting,
        ShowSearchSetting
    },
    props: {
        setting: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ["columns-change"],
    setup(props2, { emit }) {
        const table2 = useTableContext();
        const getSetting = vue.computed(() => {
            return {
                redo: true,
                size: true,
                setting: true,
                fullScreen: false,
                ...props2.setting
            };
        });
        function handleColumnChange(data) {
            emit("columns-change", data);
        }
        function getTableContainer() {
            return table2 ? vue.unref(table2.wrapRef) : document.body;
        }
        const { getBindValues } = useTableContext();
        return { getSetting, handleColumnChange, getTableContainer, getBindValues };
    }
});
const index_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$2 = { class: "table-settings" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    var _a2, _b, _c, _d, _e;
    const _component_ShowSearchSetting = vue.resolveComponent("ShowSearchSetting");
    const _component_SizeSetting = vue.resolveComponent("SizeSetting");
    const _component_ColumnSetting = vue.resolveComponent("ColumnSetting");
    const _component_FullScreenSetting = vue.resolveComponent("FullScreenSetting");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
        ((_b = (_a2 = _ctx.getBindValues) == null ? void 0 : _a2.formConfig) == null ? void 0 : _b.schemas) && ((_e = (_d = (_c = _ctx.getBindValues) == null ? void 0 : _c.formConfig) == null ? void 0 : _d.schemas) == null ? void 0 : _e.length) !== 0 ? (vue.openBlock(), vue.createBlock(_component_ShowSearchSetting, {
            key: 0,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["getPopupContainer"])) : vue.createCommentVNode("", true),
        _ctx.getSetting.size ? (vue.openBlock(), vue.createBlock(_component_SizeSetting, {
            key: 1,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["getPopupContainer"])) : vue.createCommentVNode("", true),
        _ctx.getSetting.setting ? (vue.openBlock(), vue.createBlock(_component_ColumnSetting, {
            key: 2,
            onColumnsChange: _ctx.handleColumnChange,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["onColumnsChange", "getPopupContainer"])) : vue.createCommentVNode("", true),
        _ctx.getSetting.fullScreen ? (vue.openBlock(), vue.createBlock(_component_FullScreenSetting, {
            key: 3,
            getPopupContainer: _ctx.getTableContainer
        }, null, 8, ["getPopupContainer"])) : vue.createCommentVNode("", true)
    ]);
}
const TableSetting = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3]]);
const useColumns = (getProps, tableRef) => {
    const getColumnsRef = vue.computed(() => {
        return getProps.value.columns.map((column) => {
            if (column == null ? void 0 : column.children) {
                column.children = column.children.map((item) => {
                    return utils.deepMergeObjects(basicColumn, item);
                });
                return column;
            } else {
                return utils.deepMergeObjects(basicColumn, column);
            }
        });
    });
    const getColumns = () => {
        return getColumnsRef.value;
    };
    const hideColumn = (fields) => {
        fields.forEach((field) => {
            tableRef.value.hideColumn(field);
        });
    };
    const showColumn = (fields) => {
        fields.forEach((field) => {
            tableRef.value.showColumn(field);
        });
    };
    const resetColumn = () => {
        tableRef.value.resetColumn();
    };
    const refreshColumn = () => {
        tableRef.value.refreshColumn();
    };
    return {
        getColumnsRef,
        hideColumn,
        showColumn,
        resetColumn,
        getColumns,
        refreshColumn
    };
};
const useSort = () => {
    const formSortStatus = vue.reactive({});
    const formSearchSort = vue.computed(() => {
        const ascsList = [];
        const descsList = [];
        Object.keys(formSortStatus).forEach((key2) => {
            if (formSortStatus[key2] === 1) {
                ascsList.push(key2);
            }
            if (formSortStatus[key2] === 2) {
                descsList.push(key2);
            }
        });
        const temp = {};
        if (ascsList.length !== 0)
            temp["ascs"] = ascsList.join(",");
        if (descsList.length !== 0)
            temp["descs"] = descsList.join(",");
        return temp;
    });
    return { formSearchSort, formSortStatus };
};
const _hoisted_1$1 = { key: 0 };
const _hoisted_2 = { key: 1 };
const _hoisted_3 = { key: 2 };
const _hoisted_4 = { style: { "display": "flex", "justify-content": "space-between" } };
const _hoisted_5 = { class: "flex items-center" };
const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "TablePlus",
    props: {
        api: null,
        columns: { default: () => [] },
        isShowSeq: { type: Boolean, default: true },
        isCompatible: { type: Boolean, default: false },
        actionColumn: { default: () => {
                return {
                    title: "操作",
                    field: "action",
                    width: 150,
                    fixed: "right"
                };
            } },
        isShowSearch: { type: Boolean, default: true },
        isShowRowSelection: { type: Boolean, default: true },
        isShowAction: { type: Boolean, default: true },
        isShowPagination: { type: Boolean, default: true },
        isUseDefaultEditAction: { type: Boolean, default: false },
        isShowToolbar: { type: Boolean, default: true },
        isImmediate: { type: Boolean, default: true },
        configRowSelection: { default: {
                type: "checkbox"
            } },
        formConfig: { default: {} },
        searchInfo: { default: {} },
        transSearchInfoBeforeReload: { default: () => {
                return (form) => {
                    return form;
                };
            } },
        isUseEdit: { type: Boolean },
        columnSeq: { default: () => {
                return {};
            } },
        transDataAfterReload: { default: () => {
                return (res) => res.records;
            } }
    },
    emits: [
        "register",
        "selection-change",
        "row-ensure",
        "row-cancel",
        "row-remove"
    ],
    setup(__props, { emit: emits }) {
        const props2 = __props;
        const prefixCls2 = "shy-basic-table-plus";
        const getClassName = (className) => {
            return `${prefixCls2}-${className}`;
        };
        const innerProps = vue.ref({});
        const getProps = vue.computed(() => {
            const tempProps = { ...props2, ...innerProps.value };
            if (tempProps.isCompatible) {
                tempProps.columns.forEach((column) => {
                    column.field = column.dataIndex;
                });
                return tempProps;
            } else {
                return tempProps;
            }
        });
        const setProps = (props22) => {
            innerProps.value = utils.deepMergeObjects(innerProps.value, props22);
        };
        const attrs = vue.useAttrs();
        const slots = vue.useSlots();
        const getBindValues = vue.computed(() => {
            return utils.deepMergeObjects(basicProps, attrs, getProps.value);
        });
        const { page, setPage } = usePagination();
        const handlePageChange = (current, pageSize) => {
            setPage({ current, pageSize });
            reload();
        };
        const { formSearchSort, formSortStatus } = useSort();
        const handleSortChange = (field, type) => {
            formSortStatus[field] = type;
            reload();
        };
        const getFormConfig = vue.computed(() => {
            return {
                ...getProps.value.formConfig,
                showAdvancedButton: true,
                rowProps: { gutter: 20 }
            };
        });
        const getFormSlotKeys = vue.computed(() => {
            const keys2 = Object.keys(slots);
            return keys2.map((item) => item.startsWith("form-") ? item : null).filter((item) => !!item);
        });
        function replaceFormSlotKey(key2) {
            var _a2;
            if (!key2)
                return "";
            return ((_a2 = key2 == null ? void 0 : key2.replace) == null ? void 0 : _a2.call(key2, /form-/, "")) ?? "";
        }
        const [registerForm, formActions] = useForm();
        const formSearch = vue.ref({});
        const handleSearchFormSubmit = (form) => {
            formSearch.value = getProps.value.transSearchInfoBeforeReload(form);
            reload();
        };
        const params = vue.computed(() => {
            return {
                ...getProps.value.searchInfo,
                ...formSearch.value,
                ...formSearchSort.value,
                current: page.current,
                size: page.pageSize
            };
        });
        const tableRef = vue.ref();
        const { dataSource, setTableData, reload, getTableData, addTableData } = useTableData(getProps, {
            setPage,
            params,
            tableRef
        });
        const getSwitchShowText = (column, row) => {
            const {
                unCheckedChildren = "否",
                unCheckedValue = 0,
                checkedChildren = "是",
                checkedValue = 1
            } = (column == null ? void 0 : column.editComponentProps) || {};
            if (row[column.field] == checkedValue) {
                return checkedChildren;
            } else if (row[column.field] == unCheckedValue) {
                return unCheckedChildren;
            } else {
                return "";
            }
        };
        const handleCheckboxChange = () => {
            const records = tableRef.value.getCheckboxRecords();
            emits("selection-change", records);
        };
        const handleRadioChange = () => {
            const records = tableRef.value.getRadioRecord();
            emits("selection-change", records);
        };
        const getRowSelection = () => {
            if (getProps.value.configRowSelection.type === "checkbox") {
                return vue.toRaw(tableRef.value.getCheckboxRecords());
            } else {
                return vue.toRaw(tableRef.value.getRadioRecord());
            }
        };
        const setEditByRow = (row) => {
            row._isEdit = true;
        };
        const cancelEditByRow = (row) => {
            row._isEdit = false;
        };
        const handleEditEnsure = (row) => {
            emits("row-ensure", row);
        };
        const handleEditCancel = (row) => {
            emits("row-cancel", row);
        };
        const handleRowRemove = (row) => {
            emits("row-remove", row);
        };
        const getTreeExpandRecords = () => {
            return vue.toRaw(tableRef.value.getTreeExpandRecords());
        };
        const setAllTreeExpand = () => {
            return vue.toRaw(tableRef.value.setAllTreeExpand(true));
        };
        const clearTreeExpand = () => {
            return vue.toRaw(tableRef.value.clearTreeExpand());
        };
        const setTreeExpand = (rows, checked) => {
            return vue.toRaw(tableRef.value.setTreeExpand(rows, checked));
        };
        const getVxeTableRef = () => {
            return tableRef.value;
        };
        const setSelectRowByKeys = (keys2, checked) => {
            const rows = [];
            keys2.forEach((key2) => {
                const row = tableRef.value.getRowById(key2);
                rows.push(row);
            });
            tableRef.value.setCheckboxRow(rows, checked);
        };
        const {
            getColumnsRef,
            getColumns,
            hideColumn,
            showColumn,
            resetColumn,
            refreshColumn
        } = useColumns(getProps, tableRef);
        vue.watchEffect(() => {
        });
        const tableAction = {
            reload,
            setTableData,
            setProps,
            getProps,
            getBindValues,
            getRowSelection,
            setEditByRow,
            cancelEditByRow,
            getTableData,
            getTreeExpandRecords,
            setAllTreeExpand,
            clearTreeExpand,
            setTreeExpand,
            getVxeTableRef,
            setSelectRowByKeys,
            getSize: () => {
                return vue.unref(getBindValues).size;
            },
            getColumns,
            hideColumn,
            showColumn,
            resetColumn,
            refreshColumn,
            addTableData
        };
        createTableContext({ ...tableAction });
        emits("register", tableAction, formActions);
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", {
                class: vue.normalizeClass(getClassName("wrapper"))
            }, [
                vue.unref(getProps).isShowSearch ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: vue.normalizeClass(getClassName("search"))
                }, [
                    vue.createVNode(vue.unref(BasicForm), vue.mergeProps(vue.unref(getFormConfig), {
                        onRegister: vue.unref(registerForm),
                        onSubmit: handleSearchFormSubmit,
                        onReset: handleSearchFormSubmit,
                        onAdvancedChange: _cache[0] || (_cache[0] = () => {
                        })
                    }), vue.createSlots({ _: 2 }, [
                        vue.renderList(vue.unref(getFormSlotKeys), (item) => {
                            return {
                                name: replaceFormSlotKey(item),
                                fn: vue.withCtx((data) => [
                                    vue.renderSlot(_ctx.$slots, item, vue.normalizeProps(vue.guardReactiveProps(data || {})))
                                ])
                            };
                        })
                    ]), 1040, ["onRegister"])
                ], 2)) : vue.createCommentVNode("", true),
                vue.unref(getProps).isShowToolbar ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 1,
                    class: vue.normalizeClass(getClassName("toolbar"))
                }, [
                    vue.createElementVNode("div", {
                        class: vue.normalizeClass(getClassName("toolbar-left"))
                    }, [
                        vue.renderSlot(_ctx.$slots, "toolbar")
                    ], 2),
                    vue.createElementVNode("div", {
                        class: vue.normalizeClass(getClassName("toolbar-right"))
                    }, [
                        vue.renderSlot(_ctx.$slots, "tableSetting"),
                        vue.createVNode(TableSetting)
                    ], 2)
                ], 2)) : vue.createCommentVNode("", true),
                vue.createElementVNode("div", {
                    class: vue.normalizeClass(getClassName("body"))
                }, [
                    vue.createVNode(vue.unref(vxeTable.VxeTable), vue.mergeProps({
                        ref_key: "tableRef",
                        ref: tableRef
                    }, vue.unref(getBindValues), {
                        data: vue.unref(dataSource),
                        onCheckboxAll: handleCheckboxChange,
                        onCheckboxChange: handleCheckboxChange,
                        onRadioChange: handleRadioChange,
                        "show-overflow": "",
                        "column-config": { resizable: true }
                    }), {
                        default: vue.withCtx(() => {
                            var _a2, _b, _c, _d, _e, _f;
                            return [
                                ((_b = (_a2 = vue.unref(getProps)) == null ? void 0 : _a2.configRowSelection) == null ? void 0 : _b.type) === "checkbox" && ((_c = vue.unref(getProps)) == null ? void 0 : _c.isShowRowSelection) ? (vue.openBlock(), vue.createBlock(vue.unref(vxeTable.VxeColumn), {
                                    key: 0,
                                    fixed: "left",
                                    type: "checkbox",
                                    width: "60",
                                    align: "center"
                                })) : vue.createCommentVNode("", true),
                                ((_e = (_d = vue.unref(getProps)) == null ? void 0 : _d.configRowSelection) == null ? void 0 : _e.type) === "radio" && ((_f = vue.unref(getProps)) == null ? void 0 : _f.isShowRowSelection) ? (vue.openBlock(), vue.createBlock(vue.unref(vxeTable.VxeColumn), {
                                    key: 1,
                                    fixed: "left",
                                    type: "radio",
                                    width: "60",
                                    align: "center"
                                })) : vue.createCommentVNode("", true),
                                vue.unref(getProps).isShowSeq ? (vue.openBlock(), vue.createBlock(vue.unref(vxeTable.VxeColumn), vue.mergeProps({
                                    key: 2,
                                    type: "seq",
                                    width: "60",
                                    align: "center",
                                    title: "序号"
                                }, vue.unref(getProps).columnSeq), null, 16)) : vue.createCommentVNode("", true),
                                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(getColumnsRef), (column) => {
                                    return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                                        key: column.field
                                    }, [
                                        (column == null ? void 0 : column.groupName) ? (vue.openBlock(), vue.createBlock(_sfc_main$9, {
                                            key: 0,
                                            column,
                                            onHandleSortChange: handleSortChange
                                        }, null, 8, ["column"])) : (vue.openBlock(), vue.createBlock(vue.unref(vxeTable.VxeColumn), vue.mergeProps({ key: 1 }, column, {
                                            "edit-render": (column == null ? void 0 : column.editRender) || void 0
                                        }), {
                                            default: vue.withCtx((config) => [
                                                vue.renderSlot(_ctx.$slots, column.field, vue.normalizeProps(vue.guardReactiveProps(config)), () => {
                                                    var _a3, _b2, _c2, _d2;
                                                    return [
                                                        config.row._isEdit && (column == null ? void 0 : column.isEdit) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                                                            ((_a3 = column == null ? void 0 : column.editComponentProps) == null ? void 0 : _a3.component) === "Switch" ? (vue.openBlock(), vue.createBlock(vue.unref(CellComponent), vue.mergeProps({
                                                                key: 0,
                                                                checkedValue: 1,
                                                                unCheckedValue: 0
                                                            }, (column == null ? void 0 : column.editComponentProps) || {}, {
                                                                checked: config.row[column.field],
                                                                "onUpdate:checked": ($event) => config.row[column.field] = $event
                                                            }), null, 16, ["checked", "onUpdate:checked"])) : (vue.openBlock(), vue.createBlock(vue.unref(CellComponent), vue.mergeProps({ key: 1 }, (column == null ? void 0 : column.editComponentProps) || {}, {
                                                                value: config.row[column.field],
                                                                "onUpdate:value": ($event) => config.row[column.field] = $event
                                                            }), null, 16, ["value", "onUpdate:value"]))
                                                        ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                                                            (column == null ? void 0 : column.isEdit) && ((_b2 = column == null ? void 0 : column.editComponentProps) == null ? void 0 : _b2.component) === "Select" || ((_c2 = column == null ? void 0 : column.editComponentProps) == null ? void 0 : _c2.component) === "ApiSelect" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$1, [
                                                                vue.createVNode(vue.unref(CellComponent), vue.mergeProps((column == null ? void 0 : column.editComponentProps) || {}, {
                                                                    value: config.row[column.field],
                                                                    "onUpdate:value": ($event) => config.row[column.field] = $event,
                                                                    bordered: false,
                                                                    showArrow: false,
                                                                    open: false,
                                                                    popoverVisible: false
                                                                }), null, 16, ["value", "onUpdate:value"])
                                                            ])) : (column == null ? void 0 : column.isEdit) && ((_d2 = column == null ? void 0 : column.editComponentProps) == null ? void 0 : _d2.component) === "Switch" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
                                                                vue.createElementVNode("span", null, vue.toDisplayString(getSwitchShowText(column, config.row)), 1)
                                                            ])) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(config.row[column.field]), 1))
                                                        ], 64))
                                                    ];
                                                })
                                            ]),
                                            header: vue.withCtx(() => [
                                                vue.renderSlot(_ctx.$slots, `${column.field}Header`, vue.normalizeProps(vue.guardReactiveProps({ column })), () => [
                                                    vue.createElementVNode("div", _hoisted_4, [
                                                        vue.createElementVNode("div", null, vue.toDisplayString(column.title), 1),
                                                        (column == null ? void 0 : column.sortable) ? (vue.openBlock(), vue.createBlock(_sfc_main$a, {
                                                            key: 0,
                                                            onChange: (type) => handleSortChange(column.field, type)
                                                        }, null, 8, ["onChange"])) : vue.createCommentVNode("", true)
                                                    ])
                                                ])
                                            ]),
                                            _: 2
                                        }, 1040, ["edit-render"]))
                                    ], 64);
                                }), 128)),
                                vue.unref(getProps).isShowAction ? (vue.openBlock(), vue.createBlock(vue.unref(vxeTable.VxeColumn), vue.mergeProps({
                                    key: 3,
                                    title: "操作",
                                    field: "action",
                                    align: "center"
                                }, vue.unref(getProps).actionColumn), {
                                    default: vue.withCtx((config) => [
                                        vue.createElementVNode("div", _hoisted_5, [
                                            vue.renderSlot(_ctx.$slots, "action", vue.normalizeProps(vue.guardReactiveProps(config)), () => [
                                                vue.unref(getProps).isUseDefaultEditAction ? (vue.openBlock(), vue.createBlock(_sfc_main$b, {
                                                    key: 0,
                                                    row: config.row,
                                                    onEditEnsure: ($event) => handleEditEnsure(config.row),
                                                    onEditCancel: ($event) => handleEditCancel(config.row),
                                                    onUpdateStatusEdit: (isEdit) => {
                                                        config.row._isEdit = isEdit;
                                                    },
                                                    onRowRemove: ($event) => handleRowRemove(config.row),
                                                    style: { width: "100%" }
                                                }, null, 8, ["row", "onEditEnsure", "onEditCancel", "onUpdateStatusEdit", "onRowRemove"])) : vue.createCommentVNode("", true)
                                            ])
                                        ])
                                    ]),
                                    _: 3
                                }, 16)) : vue.createCommentVNode("", true)
                            ];
                        }),
                        _: 3
                    }, 16, ["data"])
                ], 2),
                vue.unref(page).total !== 0 && vue.unref(getProps).isShowPagination ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 2,
                    class: vue.normalizeClass(getClassName("pagination"))
                }, [
                    vue.createVNode(vue.unref(antDesignVue.Pagination), {
                        size: "small",
                        total: vue.unref(page).total,
                        current: vue.unref(page).current,
                        "onUpdate:current": _cache[1] || (_cache[1] = ($event) => vue.unref(page).current = $event),
                        "page-size": vue.unref(page).pageSize,
                        "onUpdate:page-size": _cache[2] || (_cache[2] = ($event) => vue.unref(page).pageSize = $event),
                        pageSizeOptions: vue.unref(page).pageSizeOptions,
                        "show-size-changer": "",
                        "show-quick-jumper": "",
                        "show-total": (total) => `共 ${total} 条数据`,
                        onChange: handlePageChange
                    }, null, 8, ["total", "current", "page-size", "pageSizeOptions", "show-total"])
                ], 2)) : vue.createCommentVNode("", true)
            ], 2);
        };
    }
});
function useTablePlus(tableProps) {
    const tableRef = vue.ref(null);
    const formRef = vue.ref(null);
    function register(instance, formInstance) {
        vue.onUnmounted(() => {
            tableRef.value = null;
            formRef.value = null;
        });
        tableProps && instance.setProps(utils.getDynamicProps(tableProps));
        tableRef.value = instance;
        formRef.value = formInstance;
    }
    function getTableInstance() {
        const table2 = vue.unref(tableRef);
        if (!table2) {
            utils.error(
                "The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!"
            );
        }
        return table2;
    }
    const methods2 = {
        reload: () => getTableInstance().reload(),
        setProps: (props2) => getTableInstance().setProps({ ...tableProps, ...props2 }),
        setTableData: (data) => getTableInstance().setTableData(data),
        getRowSelection: () => getTableInstance().getRowSelection(),
        setEditByRow: (row) => getTableInstance().setEditByRow(row),
        getForm: () => {
            return vue.unref(formRef);
        },
        cancelEditByRow: (row) => getTableInstance().cancelEditByRow(row),
        getTableData: () => getTableInstance().getTableData(),
        getTreeExpandRecords: () => getTableInstance().getTreeExpandRecords(),
        setAllTreeExpand: () => getTableInstance().setAllTreeExpand(),
        clearTreeExpand: () => getTableInstance().clearTreeExpand(),
        setTreeExpand: (rows, checked) => getTableInstance().setTreeExpand(rows, checked),
        getVxeTableRef: () => getTableInstance().getVxeTableRef(),
        setSelectRowByKeys: (keys2, checked) => getTableInstance().setSelectRowByKeys(keys2, checked),
        addTableData: (list) => getTableInstance().addTableData(list)
    };
    return [register, methods2];
}
const withInstall$3 = (comp) => {
    comp.install = (app, options) => {
        app.component("TablePlus", comp);
    };
    return comp;
};
withInstall$3(_sfc_main$3);
const basicLabelProps = vue.reactive({
    title: {
        type: String
    },
    color: {
        type: String,
        default: "#02a7f0"
    },
    size: {
        type: [Number, String],
        default: 15
    }
});
const setDefaultConfig$2 = (config) => {
    Object.assign(basicLabelProps, config);
};
const _sfc_main$2 = vue.defineComponent({
    props: basicLabelProps,
    setup(props2) {
        const { prefixCls: prefixCls2 } = use.useDesign("basic-label");
        const getSize = vue.computed(() => {
            const unit = typeof props2.size === "number" || !isNaN(+props2.size) ? "px" : "";
            return `${props2.size}${unit}`;
        });
        return {
            prefixCls: prefixCls2,
            getSize
        };
    }
});
const BasicLabel_vue_vue_type_style_index_0_lang = "";
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(_ctx.prefixCls)
    }, [
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-title`),
            style: vue.normalizeStyle({ "--size": _ctx.getSize })
        }, vue.toDisplayString(_ctx.title), 7),
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-bar`),
            style: vue.normalizeStyle({ "--color": `${_ctx.color}` })
        }, null, 6)
    ], 2);
}
const BasicLabel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const withInstall$2 = (component) => {
    const comp = component;
    comp.install = (app, config = {}) => {
        setDefaultConfig$2(config);
        app.component("BasicLabel", component);
    };
    return component;
};
withInstall$2(BasicLabel);
const basicContainerProps = vue.reactive({
    title: {
        type: String
    },
    submitBtnText: {
        type: String,
        default: "提交"
    },
    cancelBtnText: {
        type: String,
        default: "返回"
    }
});
const setDefaultConfig$1 = (config) => {
    Object.assign(basicContainerProps, config);
};
const _sfc_main$1 = vue.defineComponent({
    components: {
        Button: antDesignVue.Button,
        ArrowLeftOutlined: ArrowLeftOutlined$1
    },
    props: basicContainerProps,
    emit: ["submit", "cancel"],
    setup(props2, { emit }) {
        const { prefixCls: prefixCls2 } = use.useDesign("basic-container");
        return {
            prefixCls: prefixCls2,
            emit
        };
    }
});
const BasicContainer_vue_vue_type_style_index_0_lang = "";
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ArrowLeftOutlined = vue.resolveComponent("ArrowLeftOutlined");
    const _component_Button = vue.resolveComponent("Button");
    return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(_ctx.prefixCls)
    }, [
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-header`)
        }, [
            vue.createElementVNode("div", {
                class: vue.normalizeClass(`${_ctx.prefixCls}-header-title`)
            }, [
                vue.createElementVNode("div", {
                    class: vue.normalizeClass(`${_ctx.prefixCls}-header-title-icon`),
                    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.emit("cancel"))
                }, [
                    vue.createVNode(_component_ArrowLeftOutlined, { style: { fontSize: `14px` } })
                ], 2),
                vue.createElementVNode("div", {
                    class: vue.normalizeClass(`${_ctx.prefixCls}-header-title-text`)
                }, vue.toDisplayString(_ctx.title), 3)
            ], 2),
            vue.createElementVNode("div", {
                class: vue.normalizeClass(`${_ctx.prefixCls}-header-extra`)
            }, [
                vue.renderSlot(_ctx.$slots, "extra")
            ], 2)
        ], 2),
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
        }, [
            vue.renderSlot(_ctx.$slots, "default")
        ], 2),
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
        }, [
            vue.renderSlot(_ctx.$slots, "buttons"),
            vue.createVNode(_component_Button, {
                type: "primary",
                onClick: _cache[1] || (_cache[1] = ($event) => _ctx.emit("submit"))
            }, {
                default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.submitBtnText), 1)
                ]),
                _: 1
            }),
            vue.createVNode(_component_Button, {
                onClick: _cache[2] || (_cache[2] = ($event) => _ctx.emit("cancel"))
            }, {
                default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.cancelBtnText), 1)
                ]),
                _: 1
            })
        ], 2)
    ], 2);
}
const BasicContainer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const withInstall$1 = (component) => {
    const comp = component;
    comp.install = (app, config = {}) => {
        setDefaultConfig$1(config);
        app.component("BasicContainer", component);
    };
    return component;
};
withInstall$1(BasicContainer);
const _hoisted_1 = {
    key: 1,
    class: "descriptions-item-content"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "DescriptionsForm",
    props: {
        schema: { default: () => [] },
        column: { default: 3 },
        bordered: { type: Boolean, default: () => false },
        labelWidth: { default: () => "100px" },
        readonly: { type: Boolean, default: () => false }
    },
    setup(__props, { expose }) {
        const props2 = __props;
        vue.useCssVars((_ctx) => ({
            "989efb00": props2.labelWidth
        }));
        const form = vue.ref({});
        const formRef = vue.ref();
        const formSelectOption = vue.reactive({});
        const handleApiOptions = (api, item) => {
            if (!api)
                return [];
            if (formSelectOption[item.field])
                return formSelectOption[item.field];
            formSelectOption[item.field] = [];
            const params = {};
            for (const key2 of item.bind || []) {
                if (!form.value[key2])
                    continue;
                params[key2] = form.value[key2];
            }
            api({ ...params }).then((res) => {
                formSelectOption[item.field] = res;
            });
            return formSelectOption[item.field];
        };
        const handleChangeBinding = (value, item) => {
            if (!item.bind)
                return;
            const params = {};
            if (item.alias)
                params[item.alias] = value;
            params[item.field] = value;
            for (const key2 of item.bind) {
                const findSchema = props2.schema.find((item2) => item2.field === key2);
                if (!(formSelectOption[key2] && (findSchema == null ? void 0 : findSchema.api)))
                    continue;
                findSchema.api({ ...params }).then((res) => {
                    form.value[key2] = void 0;
                    formSelectOption[key2] = res;
                });
            }
        };
        const filterOption = (input, option) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };
        const isFormatter = (params) => {
            const [formatter, value, record, sourceValue] = params;
            return formatter ? formatter(value, record, sourceValue) : value;
        };
        const isBindApiFieldMap = (bindApiFieldMap) => {
            var _a2, _b;
            const [bindField, bindValue] = bindApiFieldMap;
            const result = (_b = (_a2 = formSelectOption[bindField]) == null ? void 0 : _a2.filter((ele) => ele.value === form.value[bindField])) == null ? void 0 : _b.map((ele) => ele[bindValue])[0];
            return result;
        };
        const metaFormValue = (item) => {
            var _a2;
            const { formatter, metaMap, api, bindApiFieldMap, field } = item;
            if (!field)
                return "";
            if (bindApiFieldMap) {
                const result = isBindApiFieldMap(bindApiFieldMap);
                return isFormatter([formatter, result, form.value]);
            }
            if (!form.value[field] && form.value[field] !== 0)
                return "-";
            if (api) {
                return (_a2 = handleApiOptions(api, item).find(
                    (ele) => ele.value === form.value[field]
                )) == null ? void 0 : _a2.label;
            }
            if (metaMap) {
                return isFormatter([
                    formatter,
                    metaMap[form.value[field]],
                    form.value,
                    form.value[field]
                ]);
            }
            return isFormatter([formatter, form.value[field], form.value]);
        };
        const validate = vue.computed(() => {
            if (formRef.value) {
                return formRef.value.validate;
            } else {
                return null;
            }
        });
        const getFieldsValue = () => form.value;
        const resetFieldsValue = () => {
            form.value = {};
        };
        const setFieldValue = (params) => {
            form.value = { ...form.value, ...params };
        };
        expose({
            validate,
            getFieldsValue,
            setFieldValue,
            resetFieldsValue
        });
        return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.Form), {
                ref_key: "formRef",
                ref: formRef,
                model: form.value
            }, {
                default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(antDesignVue.Descriptions), {
                        bordered: __props.bordered,
                        size: "middle",
                        column: __props.column
                    }, {
                        default: vue.withCtx(() => [
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.schema, (item) => {
                                return vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.DescriptionsItem), {
                                    key: item.field,
                                    class: vue.normalizeClass({
                                        "description-active": item.required,
                                        "description-placeholder": !item.field
                                    }),
                                    span: item.span
                                }, {
                                    label: vue.withCtx(() => [
                                        vue.createVNode(vue.unref(antDesignVue.Tooltip), {
                                            title: item.label,
                                            placement: "topLeft"
                                        }, {
                                            default: vue.withCtx(() => [
                                                vue.createTextVNode(vue.toDisplayString(item.label), 1)
                                            ]),
                                            _: 2
                                        }, 1032, ["title"])
                                    ]),
                                    default: vue.withCtx(() => [
                                        !__props.readonly && (item.component || item.slot) ? (vue.openBlock(), vue.createBlock(vue.unref(antDesignVue.FormItem), {
                                            key: 0,
                                            name: item.field,
                                            rules: [{ required: item.required }]
                                        }, {
                                            default: vue.withCtx(() => [
                                                item.component ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(item.component), vue.mergeProps({
                                                    key: 0,
                                                    options: handleApiOptions(item.api, item),
                                                    showSearch: "",
                                                    filterOption,
                                                    onChange: ($event) => handleChangeBinding($event, item)
                                                }, item.componentProps, {
                                                    value: form.value[item.field],
                                                    "onUpdate:value": ($event) => form.value[item.field] = $event
                                                }), null, 16, ["options", "onChange", "value", "onUpdate:value"])) : vue.createCommentVNode("", true),
                                                item.slot ? vue.renderSlot(_ctx.$slots, item.slot, {
                                                    key: 1,
                                                    model: form.value,
                                                    field: item.field,
                                                    conf: item
                                                }, void 0, true) : vue.createCommentVNode("", true)
                                            ]),
                                            _: 2
                                        }, 1032, ["name", "rules"])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, vue.toDisplayString(metaFormValue(item)), 1))
                                    ]),
                                    _: 2
                                }, 1032, ["class", "span"]);
                            }), 128))
                        ]),
                        _: 3
                    }, 8, ["bordered", "column"])
                ]),
                _: 3
            }, 8, ["model"]);
        };
    }
});
const DescriptionsForm_vue_vue_type_style_index_0_scoped_2d2eda80_lang = "";
const descriptionsForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2d2eda80"]]);
const DescriptionsForm = utils.withInstall(descriptionsForm);
const basicResizeWrapperProps = vue.reactive({
    designWidth: {
        default: 1920,
        type: Number
    },
    designHeight: {
        default: 1080,
        type: Number
    }
});
const setDefaultConfig = (config) => {
    Object.assign(basicResizeWrapperProps, config);
};
const __default__ = vue.defineComponent({
    props: basicResizeWrapperProps,
    setup(props2, { emit }) {
        const { prefixCls: prefixCls2 } = use.useDesign("basic-resize-wrapper");
        function setScale() {
            /* @__PURE__ */ console.log("setScale", screenRef.value, currentScreenRef.value);
            screenRef.value.style.transform = `scale(${currentScreenRef.value.offsetWidth / props2.designWidth},${currentScreenRef.value.offsetHeight / props2.designHeight})`;
        }
        const screenRef = vue.ref();
        const currentScreenRef = vue.ref();
        const designWidth = vue.computed(() => `${props2.designWidth}px`);
        const designHeight = vue.computed(() => `${props2.designHeight}px`);
        window.addEventListener("resize", setScale);
        vue.onMounted(() => {
            setScale();
        });
        vue.onUnmounted(() => {
            window.removeEventListener("resize", setScale);
        });
        return {
            designWidth,
            designHeight,
            prefixCls: prefixCls2,
            screenRef,
            currentScreenRef,
            emit
        };
    }
});
const __injectCSSVars__ = () => {
    vue.useCssVars((_ctx) => ({
        "3469995a": _ctx.designWidth,
        "3efa9813": _ctx.designHeight
    }));
};
const __setup__ = __default__.setup;
__default__.setup = __setup__ ? (props2, ctx) => {
    __injectCSSVars__();
    return __setup__(props2, ctx);
} : __injectCSSVars__;
const BasicResizeWrapper_vue_vue_type_style_index_0_lang = "";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(_ctx.prefixCls),
        ref: "currentScreenRef"
    }, [
        vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-view`),
            ref: "screenRef"
        }, [
            vue.renderSlot(_ctx.$slots, "default")
        ], 2)
    ], 2);
}
const BasicResizeWrapper = /* @__PURE__ */ _export_sfc(__default__, [["render", _sfc_render]]);
const index = "";
const withInstall = (component) => {
    const comp = component;
    comp.install = (app, config = {}) => {
        setDefaultConfig(config);
        app.component("BasicResizeWrapper", component);
    };
    return component;
};
withInstall(BasicResizeWrapper);
exports.AdvancedSearch = _sfc_main$x;
exports.ApiCascader = ApiCascader;
exports.ApiModalSelect = ApiModalSelect;
exports.ApiRadioGroup = ApiRadioGroup;
exports.ApiSelect = ApiSelect;
exports.ApiTransfer = ApiTransfer;
exports.ApiTree = ApiTree;
exports.ApiTreeSelect = ApiTreeSelect;
exports.AvatarCropper = CropperAvatar;
exports.BasicArrow = BasicArrow;
exports.BasicButton = _sfc_main$Y;
exports.BasicContainer = BasicContainer;
exports.BasicDrawer = BasicDrawer;
exports.BasicForm = BasicForm;
exports.BasicHelp = _sfc_main$1g;
exports.BasicLabel = BasicLabel;
exports.BasicModal = BasicModal;
exports.BasicResizeWrapper = BasicResizeWrapper;
exports.BasicTable = BasicTable;
exports.BasicTitle = BasicTitle$1;
exports.BasicTree = _sfc_main$J;
exports.Button = Button;
exports.ClickOutSide = _sfc_main$d;
exports.CollapseContainer = _sfc_main$1d;
exports.CountButton = CountButton;
exports.CountTo = CountTo;
exports.CountdownInput = CountdownInput;
exports.CropperImage = CropperImage;
exports.Description = Description;
exports.DescriptionsForm = DescriptionsForm;
exports.Dropdown = _sfc_main$W;
exports.EditTableHeaderIcon = EditTableHeaderCell;
exports.FormItem = _sfc_main$O;
exports.Icon = Icon2;
exports.IconPicker = _sfc_main$19;
exports.LazyContainer = LazyContainer;
exports.Loading = Loading;
exports.PageFooter = PageFooter;
exports.PageSecond = PageSecond;
exports.PageWrapper = PageWrapper;
exports.PageWrapperFixedHeightKey = PageWrapperFixedHeightKey;
exports.PopConfirmButton = _sfc_main$X;
exports.RadioButtonGroup = RadioButtonGroup;
exports.RoleEnum = RoleEnum;
exports.ScrollContainer = ScrollContainer$1;
exports.Scrollbar = Scrollbar;
exports.StrengthMeter = StrengthMeter;
exports.SvgIcon = SvgIcon;
exports.TableAction = _sfc_main$V;
exports.TableChildren = Table;
exports.TableDict = TableDict;
exports.TableImg = TableImg;
exports.TablePlus = _sfc_main$3;
exports.ToolbarEnum = ToolbarEnum;
exports.add = add;
exports.componentMap = componentMap$2;
exports.createLoading = createLoading;
exports.del = del;
exports.descriptionsForm = descriptionsForm;
exports.getGlobalAdvancedType = getGlobalAdvancedType;
exports.registerGlobalConfig = registerGlobalConfig;
exports.searchType = searchType;
exports.searchTypeDate = searchTypeDate;
exports.searchTypeNumber = searchTypeNumber;
exports.searchTypeSelect = searchTypeSelect;
exports.searchTypeString = searchTypeString;
exports.stringSearchTypeSelect = stringSearchTypeSelect;
exports.treeEmits = treeEmits;
exports.treeProps = treeProps;
exports.useColumns = useColumns;
exports.useComponentRegister = useComponentRegister;
exports.useDescription = useDescription;
exports.useDrawer = useDrawer;
exports.useDrawerInner = useDrawerInner;
exports.useForm = useForm;
exports.useLoading = useLoading;
exports.useModal = useModal;
exports.useModalContext = useModalContext;
exports.useModalInner = useModalInner;
exports.useTable = useTable;
exports.useTablePlus = useTablePlus;