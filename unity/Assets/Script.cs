using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;
using UnityEngine.Events;
using WebSocketSharp;
using WebSocketSharp.Net.WebSockets;

public class Script : MonoBehaviour {

	private Animator animator;
	private Transform lamp_table;
	private Renderer lamp_component;
	public Transform StartPosition;
	public List<Transform> points;
	public UnityEvent onAction;
	public float fly_speed = 2f;
	public float detail_speed = 1f;
	public int current_destination = 0;
	public bool animation_flag = false;
	public bool is_back = false;
	public bool to_take = true;

	public Transform Broken_lamp;
	public Transform New_lamp;

	// WS
	private WebSocket ws;
	[Header("Настройки подключения")]
	[Tooltip("Для мобильных устройств используйте IP компьютера, не localhost")]
	public string url = "ws://localhost:8080/unity-ws";

	private bool isConnected = false;
	private bool isConnecting = false;

	void Start()
	{
		// Получаем компонент Animator при старте
		animator = GetComponent<Animator>();
		lamp_table = transform.Find ("Lamp_table");
		lamp_component = lamp_table.transform.Find ("Broken_lamp").gameObject.GetComponent<Renderer> ();
		lamp_component.enabled = false;

		// WS
		Connect();
	}

	// Update is called once per frame
	void Update () {
		float step = fly_speed * Time.deltaTime;
		if (!is_back && !animation_flag) {
			transform.position = Vector3.MoveTowards (transform.position, 
				points [current_destination].Find ("CheckPoint").gameObject.transform.position, step);
		} else  if (is_back && !animation_flag)
		{
			transform.position = Vector3.MoveTowards(transform.position, 
				StartPosition.position, step);
		}
		if (transform.position == points [current_destination].Find ("CheckPoint").gameObject.transform.position &&
		    !animation_flag) {
			Debug.Log ("Start Change Operation");
			animator.SetTrigger ("Lift_and_down");
			animation_flag = true;
			if (to_take) 
			{ 
				is_back = true;
			}
		}
		if (transform.position == StartPosition.position && is_back) 
		{
			if (!to_take) 
			{
				is_back = false;
				to_take = true;
				if (current_destination == (points.Count-1))
				{
					is_back = true;
					to_take = false;
				}
			} else 
			{
				is_back = false;
				to_take = false;
			}
		}

		//ws
		SendMessage(get_json_coords());

		onAction.Invoke(); // Вызывает все обработчик
	}

	public void table_up_position()
	{
		Debug.Log ("Table is up!");
		if ((current_destination + 1) != points.Count) {
			if (!to_take) {
				points [current_destination].Find ("Lamp").gameObject.GetComponent<Light> ().enabled = true;
				lamp_component.enabled = false;
				SendMessage (current_destination.ToString);  // ws

				current_destination = Math.Min (current_destination + 1, points.Count - 1);
				if ((current_destination + 1) != points.Count) {
					to_take = true;
				} else 
				{
					is_back = true;
				}
			} else {
				lamp_component.enabled = true;
				is_back = true;
			}
		} else 
		{
			is_back = true;
		}
	}

	public void Table_down_position() 
	{
		Debug.Log ("Table is down!");
		animator.SetTrigger ("To_default_state");
		animation_flag = false;
	}

	public void Connect()
	{
		if (isConnecting || isConnected)
		{
			Debug.LogWarning("Уже подключено или подключение в процессе");
			return;
		}

		try
		{
			Debug.Log("Подключение к WebSocket...");
			isConnecting = true;

			ws = new WebSocket(url);

			// Настройки
			ws.WaitTime = TimeSpan.FromSeconds(5);

			// События
			ws.OnOpen += OnOpen;
			ws.OnMessage += OnMessage;
			ws.OnError += OnError;
			ws.OnClose += OnClose;

			// Подключение (асинхронно)
			ws.ConnectAsync();
		}
		catch (Exception e)
		{
			Debug.LogError("<color=red>Ошибка подключения: " + e.Message + "</color>");
			isConnecting = false;
		}
	}

	private void OnOpen(object sender, EventArgs e)
	{
		isConnected = true;
		isConnecting = false;
		Debug.Log("<color=green>Соединение установлено!</color>");

		// Отправляем приветственное сообщение
		SendMessage("Hello from Unity Client!");
	}

	private void OnMessage(object sender, MessageEventArgs e)
	{
		if (e.IsText)
		{
			Debug.Log("Получено: " + e.Data);

			// Вызываем событие
			if (OnMessageReceived != null)
			{
				OnMessageReceived.Invoke(e.Data);
			}
		}
		else if (e.IsBinary)
		{
			Debug.Log("Получены бинарные данные: " + e.RawData.Length + " байт");
		}
	}

	private void OnError(object sender, ErrorEventArgs e)
	{
		Debug.LogError("<color=red>Ошибка WebSocket: " + e.Message + "</color>");
		if (e.Exception != null)
		{
			Debug.LogError("Исключение: " + e.Exception.Message);
		}
		isConnected = false;
		isConnecting = false;
	}

	private void OnClose(object sender, CloseEventArgs e)
	{
		Debug.LogWarning("Соединение закрыто: " + e.Reason + " (код: " + e.Code + ")");
		isConnected = false;
		isConnecting = false;
	}

	public void SendMessage(string message)
	{
		if (ws != null && isConnected)
		{
			ws.Send(message);
			Debug.Log("Отправлено: " + message);
		}
		else
		{
			Debug.LogWarning("Нельзя отправить: соединение не открыто");
		}
	}

	// Событие для обработки полученных сообщений из других скриптов
	public event Action<string> OnMessageReceived;

	// Публичный метод для проверки состояния
	public bool IsConnected
	{
		get
		{
			return isConnected && ws != null && ws.IsAlive;
		}
	}

	public void Disconnect()
	{
		if (ws != null)
		{
			try
			{
				// Отписываемся от событий
				ws.OnOpen -= OnOpen;
				ws.OnMessage -= OnMessage;
				ws.OnError -= OnError;
				ws.OnClose -= OnClose;

				// Закрываем соединение
				if (ws.IsAlive)
				{
					ws.Close(CloseStatusCode.Normal, "Client closing");
				}

				ws = null;
				isConnected = false;
				isConnecting = false;

				Debug.Log("Соединение закрыто");
			}
			catch (Exception e)
			{
				Debug.LogError("Ошибка при закрытии: " + e.Message);
			}
		}
	}

	void OnDestroy()
	{
		Disconnect();
	}

	void OnApplicationQuit()
	{
		Disconnect();
	}

	// Метод для переподключения
	public void Reconnect()
	{
		Disconnect();
		Invoke("Connect", 1f);
	}

	public string get_json_coords() 
	{
		float x = transform.position.x;
		float y = transform.position.z;
		string answ = "[" + x.ToString () + ", " + y.ToString () + "]";
	}
}
	