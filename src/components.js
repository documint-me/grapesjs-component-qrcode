import { cmpId } from "./consts";

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const { keys } = Object;

  const qrcodeProps = {
    code: "https://github.com/documint-me/grapesjs-component-qrcode",
    foreground: "#000000",
  };

  const getTraitType = (value) => {
    if (typeof value == "number") return "number";
    if (typeof value == "boolean") return "checkbox";
    if (typeof value == "object") return "select";
    if (value.startsWith("#")) return "color";
    return "text";
  };

  const traits = keys(qrcodeProps).map((name) => ({
    changeProp: 1,
    type: getTraitType(qrcodeProps[name]),
    options: qrcodeProps[name],
    min: 0,
    placeholder: "placeholder",
    name,
  }));

  domc.addType(cmpId, {
    model: {
      defaults: opts.props({
        ...qrcodeProps,
        tagName: "img",
        qrcodesrc: opts.script,
        droppable: false,
        traits,
        script() {
          const init = () => {
            const qr = new QRious({
              value: "{[ code ]}",
              backgroundAlpha: 0,
              foreground: "{[ foreground ]}",
            });

            this.src = qr.toDataURL();
          };

          if (!window.QRious) {
            const scr = document.createElement("script");
            scr.src = "{[ qrcodesrc ]}";
            scr.onload = init;
            document.body.appendChild(scr);
          } else {
            init();
          }
        },
        ...opts.qrcodeComponent,
      }),

      init() {
        const events = traits.map((i) => `change:${i.name}`).join(" ");
        this.on(events, () => {
          this.trigger("change:script");
        });
      },

      afterInit() {},
    },
  });
};
