'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api, Message, User } from '../../../../../lib/api';
import { getSocket } from '../../../../../lib/socket';
import { useAuthStore } from '../../../../../store/authStore';

export default function DMChat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [other, setOther] = useState<User | null>(null);
  const [input, setInput] = useState('');
  const user = useAuthStore((s) => s.user);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.messages.dm(id).then(setMessages).catch(() => {});
    api.users.get(id).then(setOther).catch(() => {});

    const socket = getSocket();
    socket?.on('new_dm', (msg: Message) => {
      if (msg.sender_id === id || msg.dm_user_id === id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => { socket?.off('new_dm'); };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input.trim();
    setInput('');
    getSocket()?.emit('send_dm', { toUserId: id, content });
    api.messages.sendDm(id, content).catch(() => {});
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-extrabold text-base">
          {other?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{other?.name || 'Direct Message'}</h1>
          {other?.bio && <p className="text-gray-400 text-xs">{other.bio}</p>}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-300 py-12 text-sm">Start the conversation!</p>
          )}
          {messages.map((msg) => {
            const mine = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    mine
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="border-t border-gray-100 p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${other?.name || ''}...`}
            className="flex-1 border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand transition"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-brand text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
