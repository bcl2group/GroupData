package b;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;

public final class b
{
  private static ArrayList a = new ArrayList();
  private static ArrayList b = new ArrayList();
  private static ArrayList c = new ArrayList();

  public static synchronized Integer a(Integer paramInteger, String paramString)
  {
    int i = a.size();
    for (int j = 0; j < i; j++)
      if ((((String)b.get(j)).equalsIgnoreCase(paramString)) && (a.get(j) == paramInteger))
        return (Integer)c.get(j);
    a.add(paramInteger);
    b.add(paramString);
    j = a(paramString);
    c.add(Integer.valueOf(j));
    return Integer.valueOf(j);
  }

  private static synchronized int a(String paramString)
  {
    try
    {
      MessageDigest localMessageDigest;
      (localMessageDigest = MessageDigest.getInstance("MD5")).update(paramString.getBytes());
      paramString = localMessageDigest.digest();
      int i = 0;
      for (int j = 0; j < paramString.length; j++)
        i += paramString[j];
      return i;
    }
    catch (NoSuchAlgorithmException localNoSuchAlgorithmException)
    {
    }
    return -1;
  }

  public static synchronized ArrayList a()
  {
    return a;
  }

  public static synchronized ArrayList b()
  {
    return b;
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     b.b
 * JD-Core Version:    0.6.0
 */