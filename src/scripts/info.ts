import KInfoDialog from '@/components/infoDialog.vue';
import { i18n } from '@/i18n';

export function showInfoDialog(
  content: string,
  title: string = i18n.global.t('message.info'),
  icon: string = 'info',
  canCancel: boolean = true
) {
  return new Promise<string>((res) => {
    const ele = document.createElement('div');
    document.body.appendChild(ele);
    const app = createApp(KInfoDialog, {
      canCancel,
      title,
      icon,
      content,
      onClose: (e: string) => {
        app.unmount();
        document.body.removeChild(ele);
        res(e);
      },
    });
    app.mount(ele);
  });
}
export function showInfo(content: string, title?: string) {
  showInfoDialog(content, title, 'info');
}
