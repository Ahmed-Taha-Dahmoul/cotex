from django import forms
from .models import Comment

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            self.fields['parent'].queryset = Comment.objects.exclude(id=self.instance.id)
            self.fields['parent'].label_from_instance = lambda obj: f"{obj.user.email} - {obj.text[:30]}..."

