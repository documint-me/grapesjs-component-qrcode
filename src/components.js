import { cmpId } from "./consts";

export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const { keys } = Object;

  const qrcodeProps = {
    code: 'https://documint.me/',
    foreground: '#000000',
  }

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
    extend: 'image',
    model: {
      defaults: opts.props({
        ...qrcodeProps,
        qrcodesrc: opts.script,
        droppable: false,
        traits,
        ...opts.qrcodeComponent,
      }),

      init() {
        const events = traits.map((i) => `change:${i.name}`).join(' ')
        this.on(events, this.generateQrcodeImage)
        this.generateQrcodeImage()
        this.afterInit()
      },

      afterInit() {},

      generateQrcodeImage() {
        const params = new URLSearchParams({
          dark: this.get('foreground'),
        })
        this.set({
          src: `${opts.api}?code=${this.get('code')}&${encodeURIComponent(params.toString())}`,
        })
      },
    },
    view: {
      onActive() {},
    },
  })
};
