<template>
  <Teleport to="body">
    <dialog ref="dialog">
      <div
        class="dialog-box"
        :style="{
          '--before': value,
          '--now': choiceValue.hex(),
        }"
      >
        <div class="color-pick">
          <div
            class="sl"
            :style="{
              '--s': hsv.s,
              '--v': hsv.v,
            }"
            :class="{
              'on-drag': slonDrag,
            }"
            @mousedown="(slonDrag = true), setSL($event)"
          >
            <canvas ref="slCanvas" class="sl" width="100" height="100"></canvas>
            <div class="block" @mousedown.stop="slonDrag = true"></div>
          </div>
          <div
            class="h"
            ref="hColor"
            :class="{
              'on-drag': honDrag,
            }"
            :style="{
              '--h': hsv.h,
            }"
            @mousedown="(honDrag = true), setH($event)"
          >
            <div class="block" @mousedown.stop="honDrag = true"></div>
          </div>
          <div class="right">
            <input
              type="text"
              :value="choiceValue.hex()"
              @change.capture="
                (e) => {
                  let color: ReturnType<typeof Color>;
                  const s = (e.target as HTMLInputElement).value;
                  try {
                    color = Color(s);
                  } catch {
                    try {
                      color = Color('#' + s);
                    } catch {
                      (e.target as HTMLInputElement).value = choiceValue.hex();
                      return;
                    }
                  }
                  hsv.h = color.hue();
                  hsv.s = color.saturationv();
                  hsv.v = color.value();
                }
              "
            />
            <k-icon id="eyedropper" class="eyedropper" @click="dropperColor" />
            <div class="show">
              <div class="before"></div>
              <div class="now"></div>
            </div>
          </div>
        </div>
        <div class="texts">
          <div v-for="i of ['rgb', 'hsl', 'hsv', 'cmyk'] as const">
            <p class="title">{{ i }}</p>
            <div class="values">
              <template v-for="(value, name) in choiceValue[i]().object()">
                <p>{{ name }}:</p>
                <input
                  type="text"
                  :value="Math.round(value)"
                  @change.capture="
                    (e) => {
                      const s = (e.target as HTMLInputElement).value;
                      try {
                        const n = parseInt(s, 10);
                        if (isNaN(n)) {
                          throw new Error();
                        } else {
                          const va = choiceValue[i]().object();
                          va[name] = n;
                          const co = Color(va);
                          hsv.h = co.hue();
                          hsv.s = co.saturationv();
                          hsv.v = co.value();
                        }
                      } catch {
                        (e.target as HTMLInputElement).value = Math.round(value).toString();
                      }
                    }
                  "
                />
              </template>
            </div>
          </div>
        </div>
        <div class="defined-choices" v-if="definedChoice.length">
          <button
            v-for="i of definedChoice"
            @click="(choiceValue = Color(i.value), refreshPalette())"
            :style="{
              '--value': i.value,
              '--text': getVisibleColor(i.value).hex(),
            }"
          >
            {{ i.name }}
          </button>
        </div>
        <div class="buttons">
          <button @click="close">取消</button>
          <button @click="(value = choiceValue.hex()), close()">确定</button>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
<script setup lang="ts">
import Color from 'color';
import KIcon from './icon.vue';import { getVisibleColor } from '@/scripts/uitl'

const honDrag = ref(false);
const slonDrag = ref(false);
const hColor = ref<HTMLDivElement>();

declare class EyeDropper {
  open(): Promise<{ sRGBHex: string }>;
}
type DefinedChoice = {
  name: string;
  value: string;
};
const props = withDefaults(
  defineProps<{
    definedChoice?: DefinedChoice[];
  }>(),
  {
    definedChoice: () => [] as DefinedChoice[],
  }
);
const dropper = typeof EyeDropper ? new EyeDropper() : null;
function dropperColor() {
  if (dropper) {
    dropper.open().then(
      ({ sRGBHex }) => {
        choiceValue.value = Color(sRGBHex);
        hsv.h = choiceValue.value.hue();
        hsv.s = choiceValue.value.saturationv();
        hsv.v = choiceValue.value.value();
      },
      () => {}
    );
  } else {
    alert('本浏览器不支持');
  }
}
window.addEventListener('mouseup', () => {
  honDrag.value = false;
  slonDrag.value = false;
});
window.addEventListener('mousemove', (e) => {
  if (!(e.buttons | 1)) {
    honDrag.value = false;
    return;
  }
  if (honDrag.value) setH(e);
  if (slonDrag.value) setSL(e);
});
const value = defineModel({
  type: String,
  required: true,
});
function rangeIn(min: number, value: number, max: number) {
  return Math.min(Math.max(min, value), max);
}
function setH(e: MouseEvent) {
  const rect = hColor.value?.getBoundingClientRect()!;
  if (honDrag.value) {
    hsv.h = rangeIn(0, ((e.pageY - rect.top) / rect.height) * 360, 360);
  }
}
function setSL(e: MouseEvent) {
  const rect = slCanvas.value?.getBoundingClientRect()!;
  if (slonDrag.value) {
    hsv.s = rangeIn(0, ((e.pageX - rect.left) / rect.width) * 100, 100);
    hsv.v = rangeIn(0, 100 - ((e.pageY - rect.top) / rect.height) * 100, 100);
  }
}
const slCanvas = ref<HTMLCanvasElement>();
onMounted(() => {
  watchEffect(() => {
    if (!slCanvas.value) {
      return;
    }
    const ctx = slCanvas.value.getContext('2d')!;
    ctx.clearRect(0, 0, 100, 100);
    for (let x = 0; x <= 100; x++) {
      const gradient = ctx.createLinearGradient(x, 0, x, 100);
      gradient.addColorStop(
        0,
        Color({
          h: hsv.h,
          s: x,
          v: 100,
        }).hex()
      );
      gradient.addColorStop(
        1,
        Color({
          h: hsv.h,
          s: x,
          v: 0,
        }).hex()
      );
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 0, 1, 100);
    }
  });
});
const choiceValue = ref(Color(value.value));
const hsv = reactive({
  h: choiceValue.value.hue(),
  s: choiceValue.value.saturationv(),
  v: choiceValue.value.value(),
});
function refreshPalette() {
  hsv.h = choiceValue.value.hue();
  hsv.s = choiceValue.value.saturationv();
  hsv.v = choiceValue.value.value();
}
watchEffect(() => {
  const va = Color(value.value);
  choiceValue.value = va;
  hsv.h = va.hue();
  hsv.s = va.saturationv();
  hsv.v = va.value();
});
watchEffect(() => {
  choiceValue.value = Color(
    {
      h: hsv.h,
      s: hsv.s,
      v: hsv.v,
    },
    'hsl'
  );
});
const dialog = ref<HTMLDialogElement>();
function open() {
  dialog.value?.showModal();
}
function close() {
  dialog.value?.close();
}
defineExpose({
  open,
  close,
});
</script>
<style scoped lang="scss">
input {
  display: block;
  border: none;
  outline: none;
  border-bottom: #9c9c9c solid 0.1rem;
  &:focus {
    border-bottom: #222 solid 0.1rem;
  }
}
dialog {
  outline: none;
  border: 0.1rem solid black;
}
.dialog-box {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  row-gap: 1em;
}
.color-pick {
  flex: auto 0 0;
  display: flex;
  column-gap: 2vmin;
  align-items: end;
  .sl {
    border: 0.1rem solid black;
    display: flex;
    position: relative;
    cursor: crosshair;
    canvas {
      width: 60vmin;
      height: 60vmin;
    }
    .block {
      position: absolute;
      left: calc(1% * var(--s));
      bottom: calc(1% * var(--v));
      width: 0.5rem;
      height: 0.5rem;
      border: 0.15rem solid black;
      transform: translate(-50%, 50%);
      cursor: grab;
    }
    &.on-drag {
      cursor: crosshair;
      & > .block {
        cursor: crosshair;
      }
    }
  }
  .h {
    border: 0.1rem solid black;
    position: relative;
    width: 1rem;
    height: 60vmin;

    cursor: pointer;
    background: linear-gradient(
      to bottom,
      hsl(0, 100%, 50%),
      hsl(90deg, 100%, 50%),
      hsl(180deg, 100%, 50%),
      hsl(270deg, 100%, 50%),
      hsl(0, 100%, 50%)
    );
    .block {
      position: absolute;
      cursor: grab;
      height: 0.4rem;
      border: 0.1rem solid black;
      background-color: white;
      left: -0.2rem;
      right: -0.2rem;
      top: calc(100% * var(--h) / 360);
      transform: translate(0, -50%) scale(1.2);
    }
    &.on-drag {
      cursor: grabbing;
      & > .block {
        cursor: grabbing;
      }
    }
  }
  .right {
    width: 6vmin;
    justify-content: center;
    align-items: stretch;
    display: flex;
    flex-direction: column;
    row-gap: 1vmin;
    .show {
      height: 6vmin;
      display: grid;
      grid-template-rows: 1fr 1fr;
      border: 0.1rem solid black;
      .before {
        background-color: var(--before);
      }
      .now {
        background-color: var(--now);
      }
    }
    .eyedropper {
      font-size: 2vmin;
      padding: 1vmin;
      border: 0.1rem solid black;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        background-color: black;
        color: white;
      }
    }
  }
}
.texts {
  display: flex;
  column-gap: 5vmin;
  & > * {
    flex: 1 1;
    .title {
      font-size: 1.2em;
      margin: 0;
      font-weight: bold;
    }
    .values {
      display: grid;
      grid-template-columns: max-content 1fr;
      column-gap: 1vmin;
      row-gap: 1vmin;
      input {
        width: 10vmin;
      }
      p {
        margin: 0;
        text-align: right;
      }
    }
  }
}
.buttons {
  display: flex;
  justify-content: end;
  column-gap: 1em;

  button {
    display: block;
    padding: 0.5em 1em;
    border: 0.1rem solid black;
    outline: none;
    transition: 0.3s;
    cursor: pointer;
    background-color: #d6d6d6;
    &:hover {
      background-color: #000;
      color: white;
    }
  }
}
.defined-choices {
  display: flex;
  column-gap: 1em;
  flex-wrap: wrap;
  button {
    display: block;
    padding: 0.5em 1em;
    border: solid 0.1rem var(--value);
    outline: none;
    transition: 0.3s;
    cursor: pointer;
    background-color: var(--value);
    color: var(--text);
    &:hover {
      background-color: var(--text);
      color: var(--value);
    }
  }
}
</style>
