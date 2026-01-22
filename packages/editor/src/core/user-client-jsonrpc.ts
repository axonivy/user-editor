import {
  BaseRpcClient,
  createMessageConnection,
  Emitter,
  urlBuilder,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  Event,
  UserActionArgs,
  UserClient,
  UserContext,
  UserEditorData,
  UserMetaRequestTypes,
  UserNotificationTypes,
  UserOnNotificationTypes,
  UserRequestTypes,
  UserSaveDataArgs,
  ValidationResult
} from '@axonivy/user-editor-protocol';

export class UserClientJsonRpc extends BaseRpcClient implements UserClient {
  protected onDataChangedEmitter = new Emitter<void>();
  protected onValidationChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  onValidationChanged: Event<void> = this.onValidationChangedEmitter.event;

  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.toDispose.push(this.onValidationChangedEmitter);
    this.onNotification('dataChanged', data => {
      this.onDataChangedEmitter.fire(data);
    });
    this.onNotification('validationChanged', data => {
      this.onValidationChangedEmitter.fire(data);
    });
  }

  initialize(context: UserContext): Promise<void> {
    return this.sendRequest('initialize', { ...context });
  }

  data(context: UserContext): Promise<UserEditorData> {
    return this.sendRequest('data', { ...context });
  }

  saveData(saveData: UserSaveDataArgs): Promise<EditorFileContent> {
    return this.sendRequest('saveData', { ...saveData });
  }

  validate(context: UserContext): Promise<ValidationResult[]> {
    return this.sendRequest('validate', { ...context });
  }

  meta<TMeta extends keyof UserMetaRequestTypes>(
    path: TMeta,
    args: UserMetaRequestTypes[TMeta][0]
  ): Promise<UserMetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  action(action: UserActionArgs): void {
    void this.sendNotification('action', action);
  }

  sendRequest<K extends keyof UserRequestTypes>(command: K, args?: UserRequestTypes[K][0]): Promise<UserRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof UserNotificationTypes>(command: K, args: UserNotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  onNotification<K extends keyof UserOnNotificationTypes>(kind: K, listener: (args: UserOnNotificationTypes[K]) => unknown): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-user-lsp');
  }

  public static async startClient(connection: Connection): Promise<UserClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<UserClientJsonRpc> {
    const client = new UserClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
