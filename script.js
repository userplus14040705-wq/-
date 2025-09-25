const supabaseUrl = "https://tjmmhqsjllbearwtavjm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbW1ocXNqbGxiZWFyd3RhdmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDQxNTIsImV4cCI6MjA3NDM4MDE1Mn0.SeRhXUKNL6QHXf7skjChVmowIs67ZsDXkn8qBoYQvrs";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("chatForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const msg = document.getElementById("messageInput").value;
  await supabase.from("messages").insert([{ text: msg }]);
  document.getElementById("messageInput").value = "";
});

async function loadMessages() {
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: true });
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";
  data.forEach(msg => {
    chatBox.innerHTML += `<p>${msg.text}</p>`;
  });
}

loadMessages();

supabase
  .channel('public:messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML += `<p>${payload.new.text}</p>`;
  })
  .subscribe();
